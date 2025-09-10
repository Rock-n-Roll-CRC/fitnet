"use client";

import { useEffect, useState } from "react";

import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import ChatHeader from "@/components/ChatHeader/ChatHeader";
import ChatMain from "@/components/ChatMain/ChatMain";
import ChatFooter from "@/components/ChatFooter/ChatFooter";

import { supabaseClient } from "@/services/supabase.client";
import { getProfileByUserId } from "@/services/apiProfiles";

import styles from "./Chat.module.scss";

export default function Chat({
  session,
  profile,
  messages: initialMessages,
}: {
  session: Session;
  profile: Tables<"profiles">;
  messages: (Tables<"messages"> & {
    senderProfile: Tables<"profiles">;
    receiverProfile: Tables<"profiles">;
  })[];
}) {
  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    const channelMsgs = supabaseClient
      .channel(`realtime:messages:msgs:${session.user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = payload.new as Tables<"messages">;

          if (
            newMessage.sender_id === session.user.id ||
            newMessage.receiver_id === session.user.id
          ) {
            async function fetchData() {
              const senderProfile = await getProfileByUserId(
                newMessage.sender_id,
                "client",
              );
              const receiverProfile = await getProfileByUserId(
                newMessage.receiver_id,
                "client",
              );

              if (!senderProfile || !receiverProfile) return;

              setMessages((messages) => [
                ...messages,
                { ...newMessage, senderProfile, receiverProfile },
              ]);
            }

            void fetchData();
          }
        },
      )
      .subscribe();

    return () => {
      channelMsgs.unsubscribe();
    };
  }, [session.user.id]);

  return (
    <div className={styles.chat}>
      <ChatHeader profile={profile} />

      <ChatMain session={session} messages={messages} />

      <ChatFooter profile={profile} />
    </div>
  );
}
