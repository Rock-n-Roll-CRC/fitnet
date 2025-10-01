"use client";

import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import { useEffect, useState } from "react";

import EmptyState from "@/components/EmptyState/EmptyState";
import ActiveChat from "@/components/ActiveChat/ActiveChat";
import ProfileChatItem from "@/components/ProfileChatItem/ProfileChatItem";

import { supabaseClient } from "@/services/supabase.client";
import { getActiveChats } from "@/services/apiMessages";

import OnlineCommunitySVG from "@/assets/illustrations/online-community.svg";

import styles from "./ActiveChats.module.scss";

export default function ActiveChats({
  session,
  activeChats: initialActiveChats,
  savedProfiles,
  type,
}: {
  session: Session;
  activeChats: {
    chatPartnerProfile: Tables<"profiles">;
    lastMessage: Tables<"messages">;
    unreadMessagesCount: number;
  }[];
  savedProfiles: (Tables<"saved_profiles"> & {
    saverProfile: Tables<"profiles">;
    savedProfile: Tables<"profiles">;
  })[];
  type?: "sidebar";
}) {
  const [activeChats, setActiveChats] = useState(initialActiveChats);

  const activeChatsIds = activeChats.map(
    (activeChat) => activeChat.chatPartnerProfile.user_id,
  );
  const filteredSavedProfiles = savedProfiles.filter(
    (savedProfile) =>
      !activeChatsIds.includes(savedProfile.savedProfile.user_id) &&
      !activeChatsIds.includes(savedProfile.saverProfile.user_id),
  );

  const isEmpty =
    activeChats.length === 0 && filteredSavedProfiles.length === 0;

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
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${session.user.id}`,
        },
        (payload) => {
          const newMessage = payload.new as Tables<"messages">;
          const oldMessage = payload.old as Tables<"messages">;

          if (
            newMessage.is_read &&
            !oldMessage.is_read &&
            newMessage.receiver_id === session.user.id
          ) {
            setActiveChats((activeChats) =>
              activeChats.map((activeChat) =>
                activeChat.chatPartnerProfile.user_id === newMessage.sender_id
                  ? {
                      ...activeChat,
                      unreadMessagesCount: activeChat.unreadMessagesCount - 1,
                    }
                  : activeChat,
              ),
            );
          }
        },
      )
      .subscribe();

    return () => {
      channelChats.unsubscribe();
    };
  }, [session.user.id]);

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles["active-chats"] ?? ""} ${(type && styles[`active-chats--${type}`]) || ""} ${(isEmpty && styles["active-chats--empty"]) || ""}`}
    >
      <h2 className={styles["active-chats__heading"]}>Active Chats:</h2>

      {isEmpty ? (
        <EmptyState
          illustration={OnlineCommunitySVG}
          heading={<>Looks like you have no active chats!</>}
          description={
            <>
              As soon as you add friends or start conversation with somebody,
              they will appear here.
            </>
          }
        />
      ) : (
        <ul className={styles["active-chats__list"]}>
          {activeChats.map((activeChat) => (
            <li key={activeChat.chatPartnerProfile.user_id}>
              <ActiveChat activeChat={activeChat} />
            </li>
          ))}

          {filteredSavedProfiles.map(
            ({ created_at, saverProfile, savedProfile }) => (
              <ProfileChatItem
                key={created_at}
                profile={
                  session.user.id === saverProfile.user_id
                    ? savedProfile
                    : saverProfile
                }
              />
            ),
          )}
        </ul>
      )}
    </div>
  );
}
