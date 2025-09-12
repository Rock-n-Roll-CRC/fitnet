"use client";

import type { UIEvent } from "react";
import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import { useEffect, useOptimistic, useRef, useState } from "react";

import ChatHeader from "@/components/ChatHeader/ChatHeader";
import ChatMain from "@/components/ChatMain/ChatMain";
import ChatFooter from "@/components/ChatFooter/ChatFooter";

import { supabaseClient } from "@/services/supabase.client";
import { getProfileByUserId } from "@/services/apiProfiles";

import styles from "./Chat.module.scss";

export default function Chat({
  session,
  profile,
  myProfile,
  messages: initialMessages,
}: {
  session: Session;
  profile: Tables<"profiles">;
  myProfile: Tables<"profiles">;
  messages: (Tables<"messages"> & {
    senderProfile: Tables<"profiles">;
    receiverProfile: Tables<"profiles">;
  })[];
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [autoScroll, setAutoScroll] = useState(true);
  const [optimisticMessages, sendMessage] = useOptimistic(
    messages,
    (
      state,
      message: Tables<"messages"> & {
        senderProfile: Tables<"profiles">;
        receiverProfile: Tables<"profiles">;
      },
    ) => [...state, message],
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  function handleScroll(e: UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const atBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
    setAutoScroll(atBottom);
  }

  useEffect(() => {
    if (autoScroll)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, autoScroll]);

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
    <div onScroll={handleScroll} className={styles.chat}>
      <ChatHeader profile={profile} />

      <ChatMain
        session={session}
        messages={optimisticMessages}
        messagesEndRef={messagesEndRef}
      />

      <ChatFooter
        session={session}
        profile={profile}
        myProfile={myProfile}
        onSendMessage={sendMessage}
        setAutoScroll={setAutoScroll}
      />
    </div>
  );
}
