import type { RefObject } from "react";
import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import CheckmarkOutlineSVG from "@/assets/icons/checkmark-outline.svg";
import CheckmarkDoneOutlineSVG from "@/assets/icons/checkmark-done-outline.svg";

import styles from "./ChatMain.module.scss";

export default function ChatMain({
  session,
  messages,
  messageContainerRef,
  messagesEndRef,
}: {
  session: Session;
  messages: (Tables<"messages"> & {
    senderProfile: Tables<"profiles">;
    receiverProfile: Tables<"profiles">;
  })[];
  messageContainerRef: RefObject<HTMLElement | null>;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <section ref={messageContainerRef} className={styles["chat-main"]}>
      <div className={styles["chat-main__body"]}>
        {messages.map((message, index) => (
          <div
            key={message.id}
            ref={index === messages.length - 1 ? messagesEndRef : undefined}
            data-id={message.id}
            className={`${styles["chat-main__message-box"] ?? ""} ${styles[`chat-main__message-box--${message.sender_id === session.user.id ? "user" : "partner"}`] ?? ""}`}
          >
            {message.content}
            <span
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              className={`${styles["chat-main__message-read"] ?? ""} ${(message.is_read && styles["chat-main__message-read--read"]) || ""}`}
            >
              {message.sender_id === session.user.id ? (
                message.is_read ? (
                  <CheckmarkDoneOutlineSVG
                    className={styles["chat-main__message-read-icon"]}
                  />
                ) : (
                  <CheckmarkOutlineSVG
                    className={styles["chat-main__message-read-icon"]}
                  />
                )
              ) : null}

              {new Date(message.created_at).toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
