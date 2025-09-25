"use client";

import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import { useEffect, useState } from "react";

import ActiveChat from "@/components/ActiveChat/ActiveChat";

import { supabaseClient } from "@/services/supabase.client";
import { getActiveChats } from "@/services/apiMessages";

import styles from "./ActiveChats.module.scss";

export default function ActiveChats({
  session,
  activeChats: initialActiveChats,
}: {
  session: Session;
  activeChats: {
    chatPartnerProfile: Tables<"profiles">;
    lastMessage: Tables<"messages">;
    unreadMessagesCount: number;
  }[];
}) {
  const [activeChats, setActiveChats] = useState(initialActiveChats);

  useEffect(() => {
    const channelChats = supabaseClient
      .channel(`realtime:messages:chats:${session.user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMessage = payload.new;

          if (
            newMessage.sender_id === session.user.id ||
            newMessage.receiver_id === session.user.id
          ) {
            async function fetchData() {
              const newActiveChats = await getActiveChats(
                session.user.id,
                "client",
              );
              setActiveChats(newActiveChats);
            }
            void fetchData();
          }
        },
      )
      .subscribe();

    return () => {
      channelChats.unsubscribe();
    };
  }, [session.user.id]);

  return (
    <ul className={styles["active-chats"]}>
      {activeChats.map((activeChat) => (
        <li key={activeChat.chatPartnerProfile.user_id}>
          <ActiveChat activeChat={activeChat} />
        </li>
      ))}
    </ul>
  );
}
