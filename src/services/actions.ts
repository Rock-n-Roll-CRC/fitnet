"use server";

import { hash } from "bcrypt";
import { z, ZodError } from "zod/v4";

import { supabase } from "@/services/supabase";
import { auth, signIn } from "@/services/auth";
import { getUserByEmail } from "@/services/apiUsers";
import { CredentialsSignin } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { revalidatePath } from "next/cache";
import type { Tables } from "@/types/database";
import { isBlocked } from "./apiBlockedProfiles";

const SignUpFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must contain less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must contain less than 50 characters"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .max(20, "Phone number must contain less than 20 characters")
    .regex(
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      "Provided phone number is invalid",
    ),
  email: z
    .email("Provided email is invalid")
    .min(1, "Email is required")
    .max(100, "Email must contain less than 100 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must contain at least 8 characters")
    .max(20, "Password must contain less than 20 characters"),
});

const SignInFormSchema = z.object({
  email: z
    .email("Provided email is invalid")
    .min(1, "Email is required")
    .max(100, "Email must contain less than 100 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must contain at least 8 characters")
    .max(20, "Password must contain less than 20 characters"),
});

export const signInWithGoogle = async () => {
  await signIn("google", { redirectTo: "/" });
};

export const signInWithCredentials = async (credentials: FormData) => {
  try {
    const credentialsObj = Object.fromEntries(credentials.entries());

    const { email, password } = SignInFormSchema.parse(credentialsObj);

    await signIn("credentials", {
      email,
      password,
      redirectTo: "/",
    });
  } catch (error) {
    if (isRedirectError(error)) throw error;

    const isCredentialsError = error instanceof CredentialsSignin;
    const isZodError = error instanceof ZodError;

    const errorMessage = `Failed to sign in: ${isCredentialsError || isZodError ? "Provided credentials are invalid" : "Something went wrong"}`;

    console.error(errorMessage);
    throw new Error(errorMessage);
  }
};

export const signUpWithCredentials = async (credentials: FormData) => {
  try {
    const credentialsObj = Object.fromEntries(credentials.entries());

    const { email, password } = SignUpFormSchema.parse(credentialsObj);

    const existingUserByEmail = await getUserByEmail(email);

    if (existingUserByEmail)
      throw new Error("A user with this email already exists.");

    const { data: user, error: usersError } = await supabase
      .from("users")
      .insert([
        {
          email: email,
          password_hash: await hash(password, 10),
        },
      ])
      .select()
      .single();

    if (usersError)
      throw new Error(usersError.message, { cause: usersError.cause });
  } catch (error) {
    const isError = error instanceof Error;
    const isZodError = error instanceof ZodError;

    if (isError || isZodError) {
      const errorMessage = `Failed to sign up a new user with credentials: ${(isZodError ? error.issues.at(0)?.message : error.message) ?? "Something went wrong"}`;

      console.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
};

export const deleteSavedProfile = async (savedUserId: string) => {
  const { error } = await supabase
    .from("saved_profiles")
    .delete()
    .or(`saver_user_id.eq.${savedUserId},saved_user_id.eq.${savedUserId}`);

  if (error)
    throw new Error(`Failed to delete a saved profile: ${error.message}`, {
      cause: error.cause,
    });

  revalidatePath("/favourites");
};

export const updateProfileLocation = async (
  userId: string,
  location: {
    lat: number;
    lng: number;
  },
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ location })
    .eq("user_id", userId)
    .select();

  if (error) {
    console.error(error.message);
    throw new Error(`Failed to update profile location: ${error.message}`, {
      cause: error.cause,
    });
  }

  return data;
};

export const updateProfileIsSearching = async (value: boolean) => {
  const session = await auth();

  if (!session) return;

  const { data, error } = await supabase
    .from("profiles")
    .update({ isSearching: value })
    .eq("user_id", session.user.id)
    .select();

  if (error) {
    console.error(error.message);
    throw new Error(`Failed to update profile is searching: ${error.message}`, {
      cause: error.cause,
    });
  }

  revalidatePath("/search");

  return data;
};

export const sendConnectionRequest = async (userId: string) => {
  const session = await auth();

  if (!session) return;

  const { data: duplicate, error: duplicateError } = await supabase
    .from("connection_requests")
    .select("*")
    .eq("sender_id", session.user.id)
    .eq("receiver_id", userId)
    .eq("status", "pending")
    .maybeSingle();

  if (duplicateError) {
    console.error(duplicateError.message);
    throw new Error(
      `Failed to send connection request: ${duplicateError.message}`,
      { cause: duplicateError.cause },
    );
  }

  if (duplicate) return;

  const { data, error } = await supabase
    .from("connection_requests")
    .insert({ sender_id: session.user.id, receiver_id: userId })
    .select()
    .single();

  if (error) {
    console.error(error.message);
    throw new Error(`Failed to send connection request: ${error.message}`, {
      cause: error.cause,
    });
  }

  const isProfileBlocked = await isBlocked(userId, session.user.id);

  if (!isProfileBlocked) {
    const { error: notifError } = await supabase.from("notifications").insert({
      user_id: userId,
      type: "REQUEST_RECEIVED",
      sender_id: session.user.id,
    });

    if (notifError) {
      console.error(notifError.message);
      throw new Error(
        `Failed to send connection request: ${notifError.message}`,
        {
          cause: notifError.cause,
        },
      );
    }
  }

  revalidatePath("/profile");

  return data;
};

export const acceptConnectionRequest = async (
  request: Tables<"connection_requests"> & {
    senderProfile: Tables<"profiles">;
    receiverProfile: Tables<"profiles">;
  },
) => {
  const { data: acceptedRequest, error: acceptedRequestError } = await supabase
    .from("connection_requests")
    .update({ status: "accepted" })
    .eq("id", request.id)
    .select()
    .maybeSingle();

  if (acceptedRequestError) {
    console.error(acceptedRequestError.message);
    throw new Error(
      `Failed to accept connection request: ${acceptedRequestError.message}`,
      {
        cause: acceptedRequestError.cause,
      },
    );
  }

  if (!acceptedRequest) {
    revalidatePath("/favourites");
    return;
  }

  const { data: duplicate, error: duplicateError } = await supabase
    .from("saved_profiles")
    .select()
    .eq("saver_user_id", request.receiver_id)
    .eq("saved_user_id", request.sender_id)
    .maybeSingle();

  if (duplicateError) {
    console.error(`Failed to save a user profile: ${duplicateError.message}`);
    throw new Error(
      `Failed to save a user profile: ${duplicateError.message}`,
      {
        cause: duplicateError.cause,
      },
    );
  }

  if (duplicate) return;

  const { data, error } = await supabase
    .from("saved_profiles")
    .insert([
      { saver_user_id: request.receiver_id, saved_user_id: request.sender_id },
    ])
    .select();

  if (error) {
    console.error(`Failed to save a user profile: ${error.message}`);
    throw new Error(`Failed to save a user profile: ${error.message}`, {
      cause: error.cause,
    });
  }

  revalidatePath("/favourites");

  const { error: notifError } = await supabase.from("notifications").insert({
    user_id: request.sender_id,
    type: "REQUEST_ACCEPTED",
    sender_id: request.receiver_id,
  });

  if (notifError) {
    console.error(`Failed to save a user profile: ${notifError.message}`);
    throw new Error(`Failed to save a user profile: ${notifError.message}`, {
      cause: notifError.cause,
    });
  }
};

export const declineConnectionRequest = async (
  request: Tables<"connection_requests"> & {
    senderProfile: Tables<"profiles">;
    receiverProfile: Tables<"profiles">;
  },
) => {
  const { data, error } = await supabase
    .from("connection_requests")
    .update({ status: "declined" })
    .eq("id", request.id)
    .select();

  if (error) {
    console.error(error.message);
    throw new Error(`Failed to decline connection request: ${error.message}`, {
      cause: error.cause,
    });
  }

  revalidatePath("/favourites");
};

export const deleteConnectionRequest = async (
  request: Tables<"connection_requests"> & {
    senderProfile: Tables<"profiles">;
    receiverProfile: Tables<"profiles">;
  },
) => {
  const { error } = await supabase
    .from("connection_requests")
    .delete()
    .eq("id", request.id)
    .eq("status", "pending");

  if (error) {
    console.error(error.message);
    throw new Error(`Failed to delete connection request: ${error.message}`, {
      cause: error.cause,
    });
  }

  revalidatePath("/favourites");
};

export const blockProfile = async (userId: string) => {
  const session = await auth();

  if (!session) return;

  const { error } = await supabase
    .from("blocked_profiles")
    .insert({ blocker_id: session.user.id, blocked_id: userId });

  if (error) {
    console.error(error.message);
    throw new Error(`Failed to block profile: ${error.message}`, {
      cause: error.cause,
    });
  }

  await deleteSavedProfile(userId);
  await declineConnectionRequestByIds(session.user.id, userId);

  revalidatePath("/search");
};

export const unblockProfile = async (userId: string) => {
  const session = await auth();

  if (!session) return;

  const { error } = await supabase
    .from("blocked_profiles")
    .delete()
    .eq("blocker_id", session.user.id)
    .eq("blocked_id", userId);

  if (error) {
    console.error(error.message);
    throw new Error(`Failed to unblock profile: ${error.message}`, {
      cause: error.cause,
    });
  }

  revalidatePath("/search");
};

export const declineConnectionRequestByIds = async (
  senderId: string,
  receiverId: string,
) => {
  const { error } = await supabase
    .from("connection_requests")
    .update({ status: "declined" })
    .eq("sender_id", senderId)
    .eq("receiver_id", receiverId)
    .eq("status", "pending");

  if (error)
    throw new Error(
      `Failed to decline connection request by user_id: ${error.message}`,
      { cause: error.cause },
    );
};

export const sendMessage = async (userId: string, formData: FormData) => {
  const session = await auth();

  if (!session) return;

  const content = formData.get("message") as string;

  const { data, error } = await supabase
    .from("messages")
    .insert({ content, sender_id: session.user.id, receiver_id: userId })
    .select()
    .single();

  if (error)
    throw new Error(`Failed to send the message: ${error.message}`, {
      cause: error.cause,
    });

  const { error: notifError } = await supabase.from("notifications").insert({
    user_id: userId,
    type: "NEW_MESSAGE",
    sender_id: session.user.id,
  });

  if (notifError)
    throw new Error(`Failed to send the message: ${notifError.message}`, {
      cause: notifError.cause,
    });
};

export const clearNotifications = async () => {
  const session = await auth();

  if (!session) return;

  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("user_id", session.user.id);

  if (error)
    throw new Error(`Failed to clear notifications: ${error.message}`, {
      cause: error.cause,
    });

  revalidatePath("/notifications");
};

export const readAllNotifications = async () => {
  const session = await auth();

  if (!session) return;

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", session.user.id);

  if (error)
    throw new Error(`Failed to read all notifications: ${error.message}`, {
      cause: error.cause,
    });

  revalidatePath("/notifications");
};

export const readNotifications = async (
  notifications: Tables<"notifications">[],
) => {
  const session = await auth();

  if (!session) return;

  const ids = notifications.map((notification) => notification.id);

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", session.user.id)
    .in("id", ids);

  if (error)
    throw new Error(`Failed to read notifications: ${error.message}`, {
      cause: error.cause,
    });

  revalidatePath("/notifications");
};

export const clearMessages = async () => {
  const session = await auth();

  if (!session) return;

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("sender_id", session.user.id);

  if (error)
    throw new Error(`Failed to clear messages: ${error.message}`, {
      cause: error.cause,
    });

  revalidatePath("/messages");
};

export const updateProfile = async (newProfile: Tables<"profiles">) => {
  const session = await auth();

  if (!session) return;

  const { data, error } = await supabase
    .from("profiles")
    .update(newProfile)
    .eq("user_id", session.user.id);

  if (error)
    throw new Error(`Failed to update profile: ${error.message}`, {
      cause: error.cause,
    });

  revalidatePath("/profile");

  return data;
};

export const postReview = async (
  raterId: string,
  rateeId: string,
  rating: number,
  text: string,
) => {
  const { data: oldReview, error: duplicateError } = await supabase
    .from("reviews")
    .select()
    .eq("rater_id", raterId)
    .eq("ratee_id", rateeId)
    .maybeSingle();

  if (duplicateError)
    throw new Error(`Failed to post review: ${duplicateError.message}`, {
      cause: duplicateError.cause,
    });

  if (oldReview) {
    const { data: newReview, error } = await supabase
      .from("reviews")
      .update({ rating, content: text })
      .eq("rater_id", raterId)
      .eq("ratee_id", rateeId)
      .select()
      .single();

    if (error)
      throw new Error(`Failed to post review: ${error.message}`, {
        cause: error.cause,
      });

    const { error: notificationError } = await supabase
      .from("notifications")
      .insert({
        user_id: rateeId,
        sender_id: raterId,
        type: "NEW_REVIEW",
      });

    if (notificationError)
      throw new Error(`Failed to post review: ${notificationError.message}`, {
        cause: notificationError.cause,
      });

    revalidatePath("/profile");
    return;
  }

  const { data: newReview, error } = await supabase
    .from("reviews")
    .insert({ rater_id: raterId, ratee_id: rateeId, rating, content: text })
    .select()
    .single();

  if (error)
    throw new Error(`Failed to post review: ${error.message}`, {
      cause: error.cause,
    });

  const { error: notificationError } = await supabase
    .from("notifications")
    .insert({ user_id: rateeId, sender_id: raterId, type: "NEW_REVIEW" });

  if (notificationError)
    throw new Error(`Failed to post review: ${notificationError.message}`, {
      cause: notificationError.cause,
    });

  revalidatePath("/profile");
};
