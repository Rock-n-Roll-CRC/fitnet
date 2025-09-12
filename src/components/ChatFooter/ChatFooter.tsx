import type { Tables } from "@/types/database";

import { sendMessage } from "@/services/actions";

import SendOutlineSVG from "@/assets/icons/send-outline.svg";

import styles from "./ChatFooter.module.scss";

import { startTransition, type FormEvent } from "react";
import type { Session } from "next-auth";

export default function ChatFooter({
  profile,
  onSendMessage,
  session,
  myProfile,
}: {
  profile: Tables<"profiles">;
  onSendMessage: (
    action: {
      content: string;
      created_at: string;
      id: string;
      receiver_id: string;
      sender_id: string;
    } & {
      senderProfile: Tables<"profiles">;
      receiverProfile: Tables<"profiles">;
    },
  ) => void;
  session: Session;
  myProfile: Tables<"profiles">;
}) {
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const content = formData.get("message") as string | null;

    if (!content || content.trim().length === 0) return;

    const tempMessage: Tables<"messages"> & {
      senderProfile: Tables<"profiles">;
      receiverProfile: Tables<"profiles">;
    } = {
      content,
      created_at: new Date().toISOString(),
      id: crypto.randomUUID(),
      receiver_id: profile.user_id,
      sender_id: session.user.id,
      receiverProfile: profile,
      senderProfile: myProfile,
    };

    startTransition(() => {
      onSendMessage(tempMessage);
    });

    event.currentTarget.reset();

    await sendMessage(profile.user_id, formData);
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
