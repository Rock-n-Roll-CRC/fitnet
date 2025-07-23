import type { Tables } from "@/types/database";

import Link from "next/link";
import Image from "next/image";

import styles from "./ActiveChat.module.scss";

export default async function ActiveChat({
  activeChat: { chatPartnerProfile: profile, lastMessage },
}: {
  activeChat: {
    chatPartnerProfile: Tables<"profiles">;
    lastMessage: Tables<"messages">;
  };
}) {
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
        </div>
      </div>

      <p className={styles["active-chat__message-date"]}>
        {`${new Date(lastMessage.created_at).getHours().toString()}:${new Date(lastMessage.created_at).getMinutes().toString()}`}
      </p>
    </Link>
  );
}
