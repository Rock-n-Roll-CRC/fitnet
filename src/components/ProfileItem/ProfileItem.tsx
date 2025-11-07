"use client";

import type { Tables } from "@/types/database";

import Image from "next/image";

import {
  blockProfile,
  deleteSavedProfile,
  unblockProfile,
} from "@/services/actions";

import styles from "./ProfileItem.module.scss";
import Link from "next/link";

const ProfileItem = ({
  profile,
  type = "saved",
  date: testDate,
}: {
  profile: Tables<"profiles">;
  type?: "saved" | "blocked";
  date: string;
}) => {
  const today = new Date();
  const date = new Date(testDate);

  const differenceInHr = Math.floor(
    (today.getTime() - date.getTime()) / (1000 * 60 * 60),
  );
  const differenceInDays = Math.floor(
    Math.abs(today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  const differenceStr =
    differenceInHr < 1
      ? `just now`
      : differenceInDays < 1
        ? `${differenceInHr.toString()} hours ago`
        : differenceInDays < 7
          ? `${differenceInDays.toString()} days ago`
          : `${Math.floor(differenceInDays / 7).toString()} weeks ago`;

  async function handleDeleteProfile(userId: string) {
    await deleteSavedProfile(userId);
  }

  async function handleUnblockProfile(userId: string) {
    await unblockProfile(userId);
  }

  async function handleBlockProfile(userId: string) {
    await blockProfile(userId);
  }

  return (
    <div className={styles["profile-item"]}>
      <div className={styles["profile-item__body"]}>
        <Link
          href={`/profile/${profile.user_id}`}
          className={styles["profile-item__image-wrapper"]}
        >
          <Image
            src={profile.avatar_url}
            alt={profile.full_name}
            fill
            className={styles["profile-item__image"]}
          />
        </Link>
        <span className={styles["profile-item__name"]}>
          {profile.full_name}
        </span>
        <span className={styles["profile-item__date"]}>
          {type === "saved" ? "Added" : "Blocked"} {differenceStr}
        </span>
      </div>

      <div className={styles["profile-item__button-container"]}>
        {type === "saved" && (
          <>
            <button
              onClick={() => void handleDeleteProfile(profile.user_id)}
              className={`${styles["profile-item__button"] ?? ""} ${styles["profile-item__button--red"] ?? ""}`}
            >
              Delete
            </button>
            <Link
              href={`/messages/${profile.user_id}`}
              className={`${styles["profile-item__button"] ?? ""} ${styles["profile-item__button--green"] ?? ""}`}
            >
              Start Chat
            </Link>
            <button
              onClick={() => void handleBlockProfile(profile.user_id)}
              className={`${styles["profile-item__button"] ?? ""} ${styles["profile-item__button--red"] ?? ""}`}
            >
              Block
            </button>
          </>
        )}
        {type === "blocked" && (
          <button
            onClick={() => void handleUnblockProfile(profile.user_id)}
            className={`${styles["profile-item__button"] ?? ""} ${styles["profile-item__button--red"] ?? ""}`}
          >
            Unblock
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileItem;
