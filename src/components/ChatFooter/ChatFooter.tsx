import type { Dispatch, FormEvent, SetStateAction } from "react";

import SendOutlineSVG from "@/assets/icons/send-outline.svg";

import styles from "./ChatFooter.module.scss";

export default function ChatFooter({
  onSendMessage,
  setAutoScroll,
}: {
  onSendMessage: (content: string) => Promise<void>;
  setAutoScroll: Dispatch<SetStateAction<boolean>>;
}) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const content = formData.get("message") as string | null;

    if (!content || content.trim().length === 0) return;

    event.currentTarget.reset();

    await onSendMessage(content);

    setAutoScroll(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
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
