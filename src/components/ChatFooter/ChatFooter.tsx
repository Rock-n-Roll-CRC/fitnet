import type { FormEvent } from "react";

import SendOutlineSVG from "@/assets/icons/send-outline.svg";

import styles from "./ChatFooter.module.scss";

export default function ChatFooter({
  onSendMessage,
  unreadMessagesCount,
  onScrollToBottom,
}: {
  onSendMessage: (content: string) => Promise<void>;
  unreadMessagesCount: number;
  onScrollToBottom: () => void;
}) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const content = formData.get("message") as string | null;

    if (!content || content.trim().length === 0) return;

    event.currentTarget.reset();

    await onSendMessage(content);
  }

  return (
    <div className={styles["chat-footer"]}>
      <form
        onSubmit={handleSubmit}
        className={styles["chat-footer__body"]}
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

        {unreadMessagesCount > 0 && (
          <button
            onClick={onScrollToBottom}
            className={styles["chat-footer__unread-count"]}
          >
            You have {unreadMessagesCount} new messages!
          </button>
        )}
      </form>
    </div>
  );
}
