import type { Tables } from "@/types/database";

import Link from "next/link";
import Image from "next/image";

import styles from "./ProfileChatItem.module.scss";

export default function ProfileChatItem({
  profile,
}: {
  profile: Tables<"profiles">;
}) {
  return (
    <Link
      href={`/messages/${profile.user_id}`}
      className={styles["profile-chat-item"]}
    >
      <div className={styles["profile-chat-item__body"]}>
        <Image
          src={profile.avatar_url}
          alt={profile.full_name}
          width={30}
          height={30}
          className={styles["profile-chat-item__image"]}
        />

        <div className={styles["profile-chat-item__details"]}>
          <p className={styles["profile-chat-item__name"]}>
            {profile.full_name}
          </p>
        </div>
      </div>
    </Link>
  );
}
