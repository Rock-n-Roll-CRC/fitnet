"use client";

import type { ReactNode } from "react";

import { createContext, useEffect, useState } from "react";
import { REALTIME_SUBSCRIBE_STATES } from "@supabase/supabase-js";

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

  useEffect(() => {
    const channel = supabaseClient.channel("online-users", {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();

        setOnlineUsers(Object.keys(state));
      })
      .subscribe((status) => {
        if (status === REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          channel
            .track({
              user_id: userId,
            })
            .catch((error: unknown) => {
              console.error(error);
            });
        }
      });

    return () => {
      void channel.untrack();
      void channel.unsubscribe();
    };
  }, [userId]);

  return (
    <OnlineUsersContext.Provider value={onlineUsers}>
      {children}
    </OnlineUsersContext.Provider>
  );
}
