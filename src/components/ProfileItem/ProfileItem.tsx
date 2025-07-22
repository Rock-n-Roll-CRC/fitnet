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
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);

  const diffInDays = Math.floor(
    (today.getTime() - date.getTime()) / MS_PER_DAY,
  );

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
        <Link href={`/profile/${profile.user_id}`}>
          <Image
            src={profile.avatar_url}
            width={30}
            height={30}
            alt={profile.full_name}
            className={styles["profile-item__image"]}
          />
        </Link>
        <span className={styles["profile-item__name"]}>
          {profile.full_name}
        </span>
        <span className={styles["profile-item__date"]}>
          {type === "saved" ? "Added" : "Blocked"} {diffInDays} days ago
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
