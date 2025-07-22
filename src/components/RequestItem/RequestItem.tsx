"use client";

import type { Tables } from "@/types/database";

import Link from "next/link";
import Image from "next/image";

import {
  acceptConnectionRequest,
  blockProfile,
  declineConnectionRequest,
  deleteConnectionRequest,
} from "@/services/actions";

import styles from "./RequestItem.module.scss";

const RequestItem = ({
  request,
  type,
}: {
  request: Tables<"connection_requests"> & {
    senderProfile: Tables<"profiles">;
    receiverProfile: Tables<"profiles">;
  };
  type: "sent" | "received";
}) => {
  const profile =
    type === "sent" ? request.receiverProfile : request.senderProfile;

  const today = new Date();
  const inviteDate = new Date(profile.created_at);
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  today.setHours(0, 0, 0, 0);
  inviteDate.setHours(0, 0, 0, 0);

  const diffInDays = Math.floor(
    (today.getTime() - inviteDate.getTime()) / MS_PER_DAY,
  );

  async function handleAcceptRequest() {
    await acceptConnectionRequest(request);
  }

  async function handleDeclineRequest() {
    await declineConnectionRequest(request);
  }

  async function handleDeleteRequest() {
    await deleteConnectionRequest(request);
  }

  async function handleBlockProfile(userId: string) {
    await blockProfile(userId);
  }

  return (
    <div className={styles["request-item"]}>
      <div className={styles["request-item__body"]}>
        <Link href={`/profile/${profile.user_id}`}>
          <Image
            src={profile.avatar_url}
            width={30}
            height={30}
            alt={profile.full_name}
            className={styles["request-item__image"]}
          />
        </Link>
        <span className={styles["request-item__name"]}>
          {profile.full_name}
        </span>
        <span className={styles["request-item__invite-date"]}>
          Invite sent {diffInDays} days ago
        </span>
      </div>

      <div className={styles["request-item__button-container"]}>
        {type === "sent" ? (
          <>
            <button
              onClick={() => void handleDeleteRequest()}
              className={styles["request-item__button"]}
            >
              Delete
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => void handleAcceptRequest()}
              className={`${styles["request-item__button"] ?? ""} ${styles["request-item__button--green"] ?? ""}`}
            >
              Accept
            </button>
            <button
              onClick={() => void handleDeclineRequest()}
              className={`${styles["request-item__button"] ?? ""} ${styles["request-item__button--transparent"] ?? ""}`}
            >
              Ignore
            </button>
            <button
              onClick={() => void handleBlockProfile(profile.user_id)}
              className={`${styles["request-item__button"] ?? ""} ${styles["request-item__button--red"] ?? ""}`}
            >
              Block
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RequestItem;
