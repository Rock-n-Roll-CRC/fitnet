"use client";

import type { Tables } from "@/types/database";

import { readNotifications } from "@/services/actions";

import styles from "./MarkAsReadBtn.module.scss";

export default function MarkAsReadBtn({
  notifications,
}: {
  notifications: Tables<"notifications">[];
}) {
  return (
    <button
      onClick={() => {
        void readNotifications(notifications);
      }}
      className={styles["mark-as-read-btn"]}
    >
      Mark all as read
    </button>
  );
}
