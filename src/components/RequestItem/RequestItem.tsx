"use client";

import type { Tables } from "@/types/database";

import { startTransition } from "react";
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
  onRemove,
}: {
  request: Tables<"connection_requests"> & {
    senderProfile: Tables<"profiles">;
    receiverProfile: Tables<"profiles">;
  };
  type: "sent" | "received";
  onRemove?: (action: string) => void;
}) => {
  const profile =
    type === "sent" ? request.receiverProfile : request.senderProfile;

  const today = new Date();
  const inviteDate = new Date(request.created_at);

  const differenceInMin = Math.floor(
    (today.getTime() - inviteDate.getTime()) / (1000 * 60),
  );
  const differenceInHr = Math.floor(
    (today.getTime() - inviteDate.getTime()) / (1000 * 60 * 60),
  );
  const differenceInDays = Math.floor(
    Math.abs(today.getTime() - inviteDate.getTime()) / (1000 * 60 * 60 * 24),
  );
  const differenceStr =
    differenceInMin < 1
      ? "just now"
      : differenceInHr < 1
        ? `${differenceInMin.toString()} minutes ago`
        : differenceInDays < 1
          ? `${differenceInHr.toString()} hours ago`
          : differenceInDays < 7
            ? `${differenceInDays.toString()} days ago`
            : `${Math.floor(differenceInDays / 7).toString()} weeks ago`;

  async function handleAcceptRequest() {
    startTransition(() => {
      onRemove?.(request.id);
    });

    await acceptConnectionRequest(request);
  }

  async function handleDeclineRequest() {
    startTransition(() => {
      onRemove?.(request.id);
    });

    await declineConnectionRequest(request);
  }

  async function handleDeleteRequest() {
    startTransition(() => {
      onRemove?.(request.id);
    });

    await deleteConnectionRequest(request);
  }

  async function handleBlockProfile(userId: string) {
    startTransition(() => {
      onRemove?.(request.id);
    });

    await blockProfile(userId);
  }

  return (
    <div className={styles["request-item"]}>
      <div className={styles["request-item__top-container"]}>
        <div className={styles["request-item__image-wrapper"]}>
          <Image
            src={profile.avatar_url}
            alt={profile.full_name}
            fill
            className={styles["request-item__image"]}
          />
        </div>

        <div className={styles["request-item__text-content"]}>
          <span className={styles["request-item__name"]}>
            {profile.full_name}
          </span>
          <span className={styles["request-item__invite-date"]}>
            Request sent {differenceStr}
          </span>
        </div>
      </div>

      <div className={styles["request-item__body"]}>
        <div className={styles["request-item__button-container"]}>
          {type === "sent" ? (
            <>
              <button
                onClick={() => void handleDeleteRequest()}
                className={`${styles["request-item__button"] ?? ""} ${styles["request-item__button--red"] ?? ""}`}
              >
                Withdraw
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
    </div>
  );
};

export default RequestItem;
