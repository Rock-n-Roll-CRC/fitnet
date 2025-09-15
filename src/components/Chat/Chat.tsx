"use client";

import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import { useEffect, useRef, useState } from "react";

import ChatHeader from "@/components/ChatHeader/ChatHeader";
import ChatMain from "@/components/ChatMain/ChatMain";
import ChatFooter from "@/components/ChatFooter/ChatFooter";

import { supabaseClient } from "@/services/supabase.client";
import { getProfileByUserId } from "@/services/apiProfiles";

import styles from "./Chat.module.scss";
import { sendMessage } from "@/services/actions";

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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  async function handleSendMessageOptimistic(content: string) {
    const clientId = crypto.randomUUID();

    const message: Tables<"messages"> & {
      senderProfile: Tables<"profiles">;
      receiverProfile: Tables<"profiles">;
    } = {
      id: clientId,
      sender_id: session.user.id,
      receiver_id: profile.user_id,
      senderProfile: myProfile,
      receiverProfile: profile,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    const { senderProfile, receiverProfile, ...newMessage } = message;

    setMessages((messages) => [...messages, message]);

    setAutoScroll(true);

    await sendMessage(newMessage);
  }

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      setAutoScroll(entry?.isIntersecting ?? false);
    });

    if (messagesEndRef.current) io.observe(messagesEndRef.current);

    return () => {
      io.disconnect();
    };
  }, []);

  useEffect(() => {
    if (autoScroll)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

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

              const serverRow = {
                ...newMessage,
                senderProfile,
                receiverProfile,
              };

              setMessages((messages) =>
                messages.some((message) => message.id === newMessage.id)
                  ? messages
                  : [...messages, serverRow],
              );
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

      <ChatMain
        session={session}
        messages={messages}
        messagesEndRef={messagesEndRef}
      />

      <ChatFooter onSendMessage={handleSendMessageOptimistic} />
    </div>
  );
}
