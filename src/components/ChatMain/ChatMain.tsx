import type { RefObject } from "react";
import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import styles from "./ChatMain.module.scss";

export default function ChatMain({
  session,
  messages,
  messagesEndRef,
}: {
  session: Session;
  messages: (Tables<"messages"> & {
    senderProfile: Tables<"profiles">;
    receiverProfile: Tables<"profiles">;
  })[];
  messagesEndRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <section className={styles["chat-main"]}>
      {messages.map((message, index) => (
        <div
          key={message.id}
          ref={index === messages.length - 1 ? messagesEndRef : undefined}
          className={`${styles["chat-main__message-box"] ?? ""} ${styles[`chat-main__message-box--${message.sender_id === session.user.id ? "user" : "partner"}`] ?? ""}`}
        >
          {message.content}
          <span className={styles["chat-main__message-time"]}>
            {new Date(message.created_at).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </span>
        </div>
      ))}
    </section>
  );
}
