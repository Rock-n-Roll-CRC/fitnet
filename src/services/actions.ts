"use server";

import { hash } from "bcrypt";
import { z, ZodError } from "zod/v4";

import { supabase } from "@/services/supabase";
import { signIn } from "@/services/auth";
import { getUserByEmail, getUserByPhoneNumber } from "@/services/apiUsers";
import { CredentialsSignin } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

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

    const { firstName, lastName, phoneNumber, email, password } =
      SignUpFormSchema.parse(credentialsObj);

    const existingUserByEmail = await getUserByEmail(email);

    if (existingUserByEmail)
      throw new Error("A user with this email already exists.");

    const existingUserByPhoneNumber = await getUserByPhoneNumber(phoneNumber);

    if (existingUserByPhoneNumber)
      throw new Error("A user with this phone number already exists.");

    const { error } = await supabase
      .from("users")
      .insert([
        {
          full_name: `${firstName} ${lastName}`,
          phone_number: phoneNumber,
          email: email,
          password: await hash(password, 10),
        },
      ])
      .select();

    if (error) throw new Error(error.message, { cause: error.cause });
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
