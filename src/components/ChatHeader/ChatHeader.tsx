import type { Tables } from "@/types/database";

import Image from "next/image";

import styles from "./ChatHeader.module.scss";

export default function ChatHeader({
  profile,
}: {
  profile: Tables<"profiles">;
}) {
  return (
    <section className={styles["chat-header"]}>
      <Image
        src={profile.avatar_url}
        alt={profile.full_name}
        width={30}
        height={30}
        className={styles["chat-header__image"]}
      />
      <p className={styles["chat-header__name"]}>{profile.full_name}</p>
    </section>
  );
}
