import type { Tables } from "@/types/database";

import { sendMessage } from "@/services/actions";

import SendOutlineSVG from "@/assets/icons/send-outline.svg";

import styles from "./ChatFooter.module.scss";

export default function ChatFooter({
  profile,
}: {
  profile: Tables<"profiles">;
}) {
  return (
    <form
      action={sendMessage.bind(null, profile.user_id)}
      className={styles["chat-footer"]}
      autoComplete="off"
    >
      <input
        type="text"
        name="message"
        id="message"
        placeholder="Type your message here..."
        className={styles["chat-footer__input"]}
      />

      <button className={styles["chat-footer__button"]}>
        <SendOutlineSVG className={styles["chat-footer__button-icon"]} />
      </button>
    </form>
  );
}
