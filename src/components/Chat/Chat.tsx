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
import { readMessage } from "@/services/apiMessages";

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

  const messageContainerRef = useRef<HTMLElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const observerUnreadRef = useRef<IntersectionObserver>(null);
  const observerLastRef = useRef<IntersectionObserver>(null);

  const unreadMessages = messages.filter(
    (message) => message.sender_id !== session.user.id && !message.is_read,
  );

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

  function handleScrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }

  useEffect(() => {
    observerUnreadRef.current ??= new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.id;
            const isRead = messages.find(
              (message) => message.id === id,
            )?.is_read;

            if (!id) return;
            if (isRead) return;

            setMessages((messages) =>
              messages.map((message) =>
                message.id === id ? { ...message, is_read: true } : message,
              ),
            );

            void readMessage(id);

            observerUnreadRef.current?.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.5, rootMargin: "0px" },
    );

    unreadMessages.forEach((message) => {
      const el = messageContainerRef.current?.querySelector(
        `[data-id="${message.id}"]`,
      );

      if (!el) return;

      observerUnreadRef.current?.observe(el);
    });

    return () => {
      observerUnreadRef.current?.disconnect();
    };
  }, [messages, unreadMessages]);

  useEffect(() => {
    observerLastRef.current ??= new IntersectionObserver(
      ([entry]) => {
        setAutoScroll(entry?.isIntersecting ?? false);
      },
      { root: null, threshold: 0.5, rootMargin: "0px" },
    );

    if (messagesEndRef.current)
      observerLastRef.current.observe(messagesEndRef.current);

    return () => {
      observerLastRef.current?.disconnect();
    };
  }, [messages]);

  useEffect(() => {
    if (autoScroll)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

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
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          const updatedMessage = payload.new as Tables<"messages">;

          if (updatedMessage.sender_id === session.user.id) {
            setMessages((messages) =>
              messages.map((message) =>
                message.id === updatedMessage.id
                  ? { ...message, ...updatedMessage }
                  : message,
              ),
            );
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
        messageContainerRef={messageContainerRef}
        messagesEndRef={messagesEndRef}
      />

      <ChatFooter
        unreadMessagesCount={unreadMessages.length}
        onSendMessage={handleSendMessageOptimistic}
        onScrollToBottom={handleScrollToBottom}
      />
    </div>
  );
}
