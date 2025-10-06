"use client";

import { startTransition, type Dispatch, type SetStateAction } from "react";
import type { Session } from "next-auth";
import type { Tables } from "@/types/database";
import type { UseFormHandleSubmit } from "react-hook-form";
import type { ProfileAboutFieldValues } from "@/shared/schemas/ProfileAboutSchema";

import Link from "next/link";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import toast from "react-hot-toast";

import {
  acceptConnectionRequest,
  blockProfile,
  deleteSavedProfile,
  logOut,
  sendConnectionRequest,
  unblockProfile,
  updateProfile,
} from "@/services/actions";

import styles from "./ProfileActions.module.scss";

export default function ProfileActions({
  session,
  profile,
  setOptimisticProfile,
  editedProfile,
  setEditedProfile,
  isEditing,
  isConnected,
  isRequestSent,
  receivedRequest,
  isBlocked,
  setIsEditing,
  setIsConnectedOptim,
  setIsRequestSentOptim,
  setIsBlockedOptim,
  handleSubmit,
}: {
  session: Session;
  profile: Tables<"profiles"> & {
    ratings: (Tables<"reviews"> & {
      raterProfile: Tables<"profiles">;
    })[];
  };
  setOptimisticProfile: (
    action: Tables<"profiles"> & {
      ratings: (Tables<"reviews"> & {
        raterProfile: Tables<"profiles">;
      })[];
    },
  ) => void;
  editedProfile: Tables<"profiles"> & {
    ratings: (Tables<"reviews"> & {
      raterProfile: Tables<"profiles">;
    })[];
  };
  setEditedProfile: Dispatch<
    SetStateAction<
      Tables<"profiles"> & {
        ratings: (Tables<"reviews"> & {
          raterProfile: Tables<"profiles">;
        })[];
      }
    >
  >;
  isEditing: boolean;
  isConnected: boolean;
  isRequestSent: boolean;
  receivedRequest:
    | (Tables<"connection_requests"> & {
        senderProfile: Tables<"profiles">;
        receiverProfile: Tables<"profiles">;
      })
    | null;
  isBlocked: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  setIsConnectedOptim: (
    action: boolean | ((pendingState: boolean) => boolean),
  ) => void;
  setIsRequestSentOptim: (
    action: boolean | ((pendingState: boolean) => boolean),
  ) => void;
  setIsBlockedOptim: (
    action: boolean | ((pendingState: boolean) => boolean),
  ) => void;
  handleSubmit: UseFormHandleSubmit<ProfileAboutFieldValues>;
}) {
  const { ratings: ratingsProfile, ...profileNoRatings } = profile;
  const { ratings: ratingsEditedProfile, ...newProfile } = editedProfile;

  async function handleSwitchClick() {
    const newRole = profile.role === "client" ? "coach" : "client";

    startTransition(() => {
      setOptimisticProfile({ ...profile, role: newRole });
      setEditedProfile((profile) => ({ ...profile, role: newRole }));
    });

    await updateProfile({ ...profileNoRatings, role: newRole });
  }

  async function handleEditClick() {
    if (isEditing) {
      startTransition(() => {
        setOptimisticProfile(editedProfile);

        toast.success("Profile successfully edited!");
      });

      setIsEditing(false);

      await updateProfile(newProfile);
    } else {
      setIsEditing(true);
    }
  }

  async function handleConnectClick() {
    if (isConnected) {
      startTransition(() => {
        setIsConnectedOptim(false);
      });

      await deleteSavedProfile(profile.user_id);
    }

    if (isRequestSent) {
      startTransition(() => {
        setIsRequestSentOptim(true);
      });

      await sendConnectionRequest(profile.user_id);
    }

    if (receivedRequest) {
      startTransition(() => {
        setIsConnectedOptim(true);
      });

      await acceptConnectionRequest(receivedRequest);
    }
  }

  async function handleBlockClick() {
    if (isBlocked) {
      startTransition(() => {
        setIsBlockedOptim(false);
      });

      await unblockProfile(profile.user_id);
    } else {
      startTransition(() => {
        setIsRequestSentOptim(false);
        setIsBlockedOptim(true);
      });

      await blockProfile(profile.user_id);
    }
  }

  async function handleSignOut() {
    await toast.promise(
      async () => {
        const res = await logOut();

        if (res?.message) {
          toast.error(res.message);
        }
      },
      {
        loading: "Signing out...",
        error: (error) => {
          if (isRedirectError(error)) {
            toast.success("Sign out successfull!");
          }

          return null;
        },
      },
    );
  }

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles["profile-actions"] ?? ""} ${(session.user.id === profile.user_id && styles["profile-actions--fill"]) || ""}`}
    >
      {session.user.id === profile.user_id ? (
        <>
          <button
            onClick={handleSwitchClick}
            className={`${styles["profile-actions__button"] ?? ""} ${styles["profile-actions__button--secondary"] ?? ""} ${styles["profile-actions__button--fill"] ?? ""}`}
          >
            {`Switch to ${profile.role === "client" ? "Coach" : "Client"}`}
          </button>
          <button
            onClick={
              isEditing ? handleSubmit(handleEditClick) : handleEditClick
            }
            className={`${styles["profile-actions__button"] ?? ""} ${styles["profile-actions__button--fill"] ?? ""}`}
          >
            {isEditing ? "Save changes" : "Edit"}
          </button>
          <button
            onClick={handleSignOut}
            className={`${styles["profile-actions__button"] ?? ""} ${styles["profile-actions__button--fill"] ?? ""} ${styles["profile-actions__button--danger"] ?? ""}`}
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          {!isBlocked && (
            <button
              onClick={handleConnectClick}
              className={styles["profile-actions__button"]}
            >
              {isConnected
                ? "Remove friend"
                : isRequestSent
                  ? "Request sent"
                  : "Connect"}
            </button>
          )}

          <Link
            href={`/messages/${profile.user_id}`}
            className={`${styles["profile-actions__button"] ?? ""} ${styles["profile-actions__button--secondary"] ?? ""}`}
          >
            Message
          </Link>

          <button
            onClick={handleBlockClick}
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            className={`${styles["profile-actions__button"] ?? ""} ${styles["profile-actions__button--danger"] ?? ""} ${(!isBlocked && styles["profile-actions__button--spread"]) || ""}`}
          >
            {isBlocked ? "Unblock" : "Block"}
          </button>
        </>
      )}
    </div>
  );
}
