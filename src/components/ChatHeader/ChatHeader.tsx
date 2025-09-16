"use client";

import type { Tables } from "@/types/database";

import Image from "next/image";

import { useOnlineUsers } from "@/hooks/useOnlineUsers";

import styles from "./ChatHeader.module.scss";

export default function ChatHeader({
  profile,
}: {
  profile: Tables<"profiles">;
}) {
  const onlineUsers = useOnlineUsers();

  return (
    <section
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles["chat-header"] ?? ""} ${(onlineUsers.includes(profile.user_id) && styles["chat-header--online"]) || ""}`}
    >
      <div className={styles["chat-header__body"]}>
        <Image
          src={profile.avatar_url}
          alt={profile.full_name}
          width={30}
          height={30}
          className={styles["chat-header__image"]}
        />
        <p className={styles["chat-header__name"]}>{profile.full_name}</p>
      </div>
    </section>
  );
}
