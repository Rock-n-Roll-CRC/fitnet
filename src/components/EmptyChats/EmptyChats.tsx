import Link from "next/link";

import BubbleChatSVG from "@/assets/icons/bubble-chat.svg";

import styles from "./EmptyChats.module.scss";

export default function EmptyChats() {
  return (
    <div className={styles["empty-chats"]}>
      <div className={styles["empty-chats__body"]}>
        <BubbleChatSVG className={styles["empty-chats__icon"]} />

        <h1 className={styles["empty-chats__heading"]}>
          Start a new conversation!
        </h1>

        <p className={styles["empty-chats__description"]}>
          Tap the button below to begin chatting with someone! You never know
          what interesting conversations might come up!
        </p>
      </div>

      <Link href="/messages/start" className={styles["empty-chats__button"]}>
        Send a Message
      </Link>
    </div>
  );
}
