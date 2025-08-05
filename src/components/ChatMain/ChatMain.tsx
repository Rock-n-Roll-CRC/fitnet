import type { Tables } from "@/types/database";

import styles from "./ChatMain.module.scss";
import type { Session } from "next-auth";

export default function ChatMain({
  session,
  messages,
}: {
  session: Session;
  messages: (Tables<"messages"> & {
    senderProfile: Tables<"profiles">;
    receiverProfile: Tables<"profiles">;
  })[];
}) {
  return (
    <section className={styles["chat-main"]}>
      {messages.map((message) => (
        <div
          key={message.id}
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
