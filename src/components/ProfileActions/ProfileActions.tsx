"use client";

import type { Dispatch, SetStateAction } from "react";
import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import Link from "next/link";

import {
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
  editedProfile,
  isEditing,
  isConnected,
  isRequestSent,
  isBlocked,
  setIsEditing,
}: {
  session: Session;
  profile: Tables<"profiles">;
  editedProfile: Tables<"profiles">;
  isEditing: boolean;
  isConnected: boolean;
  isRequestSent: boolean;
  isBlocked: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}) {
  async function handleEditClick() {
    if (isEditing) {
      await updateProfile(editedProfile);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }

  function handleConnectClick() {
    if (isConnected) {
      void deleteSavedProfile(profile.user_id);
    } else {
      void sendConnectionRequest(profile.user_id);
    }
  }

  function handleBlockClick() {
    if (isBlocked) {
      void unblockProfile(profile.user_id);
    } else {
      void blockProfile(profile.user_id);
    }
  }

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles["profile-actions"] ?? ""} ${(session.user.id === profile.user_id && styles["profile-actions--fill"]) || ""}`}
    >
      {session.user.id === profile.user_id ? (
        <>
          <button
            onClick={handleEditClick}
            className={`${styles["profile-actions__button"] ?? ""} ${styles["profile-actions__button--fill"] ?? ""}`}
          >
            {isEditing ? "Save changes" : "Edit"}
          </button>
          <button
            onClick={() => {
              void logOut();
            }}
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
