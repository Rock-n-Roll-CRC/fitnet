import type { Tables } from "@/types/database";

import Link from "next/link";
import Image from "next/image";

import { useOnlineUsers } from "@/hooks/useOnlineUsers";

import styles from "./ActiveChat.module.scss";

export default function ActiveChat({
  activeChat: { chatPartnerProfile: profile, lastMessage, unreadMessagesCount },
}: {
  activeChat: {
    chatPartnerProfile: Tables<"profiles">;
    lastMessage: Tables<"messages">;
    unreadMessagesCount: number;
  };
}) {
  const onlineUsers = useOnlineUsers();
  const isOnline = onlineUsers.includes(profile.user_id);

  return (
    <Link
      href={`/messages/${profile.user_id}`}
      className={styles["active-chat"]}
    >
      <div className={styles["active-chat__body"]}>
        <Image
          src={profile.avatar_url}
          alt={profile.full_name}
          width={30}
          height={30}
          className={styles["active-chat__image"]}
        />

        <div className={styles["active-chat__details"]}>
          <p className={styles["active-chat__name"]}>{profile.full_name}</p>
          <p className={styles["active-chat__message"]}>
            {lastMessage.content}
          </p>
          {isOnline && (
            <span className={styles["active-chat__online-status"]}></span>
          )}
        </div>
      </div>

      <p className={styles["active-chat__message-date"]}>
        {new Date(lastMessage.created_at).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })}
      </p>

      {unreadMessagesCount > 0 && (
        <p className={styles["active-chat__unread-message-count"]}>
          {unreadMessagesCount}
        </p>
      )}
    </Link>
  );
}
