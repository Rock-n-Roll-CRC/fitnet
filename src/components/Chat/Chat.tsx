"use client";

import { useEffect, useState } from "react";

import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import ChatHeader from "@/components/ChatHeader/ChatHeader";
import ChatMain from "@/components/ChatMain/ChatMain";
import ChatFooter from "@/components/ChatFooter/ChatFooter";

import { supabaseClient } from "@/services/supabase.client";
import { getProfileByUserId } from "@/services/apiProfiles";

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
    const channel = supabaseClient
      .channel("realtime:messages")
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
      supabaseClient.removeChannel(channel);
    };
  }, [session.user.id]);

  return (
    <>
      <ChatHeader profile={profile} />

      <ChatMain session={session} messages={messages} />

      <ChatFooter profile={profile} />
    </>
  );
}
