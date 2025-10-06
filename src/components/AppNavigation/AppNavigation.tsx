"use client";

import type { Tables } from "@/types/database";

import Link from "next/link";
import { usePathname } from "next/navigation";

import PeopleOutlineSVG from "@/assets/icons/people-outline.svg";
import CompassOutlineSVG from "@/assets/icons/compass-outline.svg";
import PersonOutlineSVG from "@/assets/icons/person-outline.svg";
import PeopleSVG from "@/assets/icons/people.svg";
import CompassSVG from "@/assets/icons/compass.svg";
import PersonSVG from "@/assets/icons/person.svg";
import ChatbubbleEllipsesSVG from "@/assets/icons/chatbubble-ellipses.svg";
import ChatbubbleEllipsesOutlineSVG from "@/assets/icons/chatbubble-ellipses-outline.svg";
import NotificationsSVG from "@/assets/icons/notifications.svg";
import NotificationsOutlineSVG from "@/assets/icons/notifications-outline.svg";

import styles from "./AppNavigation.module.scss";
import type { Session } from "next-auth";
import { useEffect, useState } from "react";
import { supabaseClient } from "@/services/supabase.client";

const AppNavigation = ({
  session,
  unreadMessagesCount: initialUnreadMessagesCount,
  unreadNotificationsCount: initialUnreadNotificationsCount,
}: {
  session: Session;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
}) => {
  const pathname = usePathname();

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(
    initialUnreadMessagesCount,
  );
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(
    initialUnreadNotificationsCount,
  );

  useEffect(() => {
    const channelMsgs = supabaseClient
      .channel(`realtime:messages:msgs:count:${session.user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${session.user.id}`,
        },
        () => {
          setUnreadMessagesCount((prev) => prev + 1);
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

          if (newMessage.is_read && !oldMessage.is_read) {
            setUnreadMessagesCount((prev) => prev - 1);
          }
        },
      )
      .subscribe();

    const channelNtfcs = supabaseClient
      .channel(`realtime:notifications:ntfcs:count:${session.user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${session.user.id}`,
        },
        () => {
          setUnreadNotificationsCount((prev) => prev + 1);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as Tables<"notifications">;
          const oldNotification = payload.old as Tables<"notifications">;

          if (newNotification.is_read && !oldNotification.is_read) {
            setUnreadNotificationsCount((prev) => prev - 1);
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${session.user.id}`,
        },
        () => {
          setUnreadNotificationsCount((prev) => (prev > 0 ? prev - 1 : 0));
        },
      )
      .subscribe();

    return () => {
      channelMsgs.unsubscribe();
      channelNtfcs.unsubscribe();
    };
  }, [session.user.id]);

  return (
    <aside className={styles["app-navigation"]}>
      <nav className={styles["app-navigation__nav"]}>
        <ul className={styles["app-navigation__list"]}>
          <li className={styles["app-navigation__list-item"]}>
            <Link
              href="/connections/friends"
              className={styles["app-navigation__nav-link"]}
            >
              {pathname.startsWith("/connections") ? (
                <>
                  <PeopleSVG
                    className={`${styles["app-navigation__nav-link-icon"] ?? ""} ${styles["app-navigation__nav-link-icon--filled"] ?? ""}`}
                  />
                </>
              ) : (
                <PeopleOutlineSVG
                  className={styles["app-navigation__nav-link-icon"]}
                />
              )}
            </Link>
            {pathname.startsWith("/connections") && (
              <span
                className={styles["app-navigation__nav-link-stroke"]}
              ></span>
            )}
          </li>
          <li className={styles["app-navigation__list-item"]}>
            <Link
              href={`/messages`}
              className={styles["app-navigation__nav-link"]}
            >
              {pathname.startsWith(`/messages`) ? (
                <>
                  <ChatbubbleEllipsesSVG
                    className={`${styles["app-navigation__nav-link-icon"] ?? ""} ${styles["app-navigation__nav-link-icon--filled"] ?? ""}`}
                  />
                </>
              ) : (
                <ChatbubbleEllipsesOutlineSVG
                  className={styles["app-navigation__nav-link-icon"]}
                />
              )}

              {unreadMessagesCount > 0 && (
                <div className={styles["app-navigation__nav-link-count"]}>
                  {unreadMessagesCount}
                </div>
              )}
            </Link>
            {pathname.startsWith(`/messages`) && (
              <span
                className={styles["app-navigation__nav-link-stroke"]}
              ></span>
            )}
          </li>
          <li className={styles["app-navigation__list-item"]}>
            <Link
              href="/search"
              className={`${styles["app-navigation__nav-link"] ?? ""} ${styles["app-navigation__nav-link--circled"] ?? ""}`}
            >
              {pathname === "/search" ? (
                <>
                  <CompassSVG
                    className={`${styles["app-navigation__nav-link-icon"] ?? ""} ${styles["app-navigation__nav-link-icon--filled"] ?? ""}`}
                  />
                </>
              ) : (
                <CompassOutlineSVG
                  className={styles["app-navigation__nav-link-icon"]}
                />
              )}
            </Link>
            {pathname === "/search" && (
              <span
                className={styles["app-navigation__nav-link-stroke"]}
              ></span>
            )}
          </li>

          <li className={styles["app-navigation__list-item"]}>
            <Link
              href="/notifications"
              className={styles["app-navigation__nav-link"]}
            >
              {pathname.startsWith("/notifications") ? (
                <>
                  <NotificationsSVG
                    className={`${styles["app-navigation__nav-link-icon"] ?? ""} ${styles["app-navigation__nav-link-icon--filled"] ?? ""}`}
                  />
                </>
              ) : (
                <NotificationsOutlineSVG
                  className={styles["app-navigation__nav-link-icon"]}
                />
              )}

              {unreadNotificationsCount > 0 && (
                <div className={styles["app-navigation__nav-link-count"]}>
                  {unreadNotificationsCount}
                </div>
              )}
            </Link>
            {pathname.startsWith("/notifications") && (
              <span
                className={styles["app-navigation__nav-link-stroke"]}
              ></span>
            )}
          </li>
          <li className={styles["app-navigation__list-item"]}>
            <Link
              href={`/profile/${session.user.id}`}
              className={styles["app-navigation__nav-link"]}
            >
              {pathname === `/profile/${session.user.id}` ? (
                <>
                  <PersonSVG
                    className={`${styles["app-navigation__nav-link-icon"] ?? ""} ${styles["app-navigation__nav-link-icon--filled"] ?? ""}`}
                  />
                </>
              ) : (
                <PersonOutlineSVG
                  className={styles["app-navigation__nav-link-icon"]}
                />
              )}
            </Link>
            {pathname === `/profile/${session.user.id}` && (
              <span
                className={styles["app-navigation__nav-link-stroke"]}
              ></span>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AppNavigation;
