"use client";

import type { ReactNode } from "react";

import { createContext, useEffect, useRef, useState } from "react";
import {
  REALTIME_SUBSCRIBE_STATES,
  RealtimeChannel,
} from "@supabase/supabase-js";

import { supabaseClient } from "@/services/supabase.client";

export const OnlineUsersContext = createContext<string[]>([]);

export function OnlineUsersProvider({
  userId,
  children,
}: {
  userId: string;
  children: ReactNode;
}) {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const channelRef = useRef<RealtimeChannel>(null);

  useEffect(() => {
    const cleanupPrevious = async () => {
      if (channelRef.current) {
        await channelRef.current.untrack();
        await channelRef.current.unsubscribe();
      }

      channelRef.current = null;
      setOnlineUsers([]);
    };

    const init = async () => {
      await cleanupPrevious();

      const channel = supabaseClient.channel(`presence:users`, {
        config: { presence: { key: userId } },
      });
      channelRef.current = channel;

      const syncOnlineFromChannel = () => {
        const state = channel.presenceState();
        setOnlineUsers(Object.keys(state));
      };

      channel.on("presence", { event: "sync" }, syncOnlineFromChannel);
      channel.on("presence", { event: "join" }, syncOnlineFromChannel);
      channel.on("presence", { event: "leave" }, syncOnlineFromChannel);

      channel.subscribe((status) => {
        const func = async () => {
          await channel.track({ userId });
          syncOnlineFromChannel();
        };

        if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          void func();
        }
      });
    };

    void init();

    return () => {
      void cleanupPrevious();
    };
  }, [userId]);

  return (
    <OnlineUsersContext.Provider value={onlineUsers}>
      {children}
    </OnlineUsersContext.Provider>
  );
}
