"use client";

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

import styles from "./AppFooter.module.scss";
import type { Session } from "next-auth";

const AppFooter = ({ session }: { session: Session }) => {
  const pathname = usePathname();

  return (
    <footer className={styles["app-footer"]}>
      <nav className={styles["app-footer__nav"]}>
        <ul className={styles["app-footer__list"]}>
          <li className={styles["app-footer__list-item"]}>
            <Link
              href="/connections/friends"
              className={styles["app-footer__nav-link"]}
            >
              {pathname.startsWith("/connections") ? (
                <>
                  <PeopleSVG
                    className={`${styles["app-footer__nav-link-icon"] ?? ""} ${styles["app-footer__nav-link-icon--filled"] ?? ""}`}
                  />
                  <span
                    className={styles["app-footer__nav-link-stroke"]}
                  ></span>
                </>
              ) : (
                <PeopleOutlineSVG
                  className={styles["app-footer__nav-link-icon"]}
                />
              )}
            </Link>
          </li>
          <li className={styles["app-footer__list-item"]}>
            <Link href={`/messages`} className={styles["app-footer__nav-link"]}>
              {pathname.startsWith(`/messages`) ? (
                <>
                  <ChatbubbleEllipsesSVG
                    className={`${styles["app-footer__nav-link-icon"] ?? ""} ${styles["app-footer__nav-link-icon--filled"] ?? ""}`}
                  />
                  <span
                    className={styles["app-footer__nav-link-stroke"]}
                  ></span>
                </>
              ) : (
                <ChatbubbleEllipsesOutlineSVG
                  className={styles["app-footer__nav-link-icon"]}
                />
              )}
            </Link>
          </li>
          <li className={styles["app-footer__list-item"]}>
            <Link
              href="/search"
              className={`${styles["app-footer__nav-link"] ?? ""} ${styles["app-footer__nav-link--circled"] ?? ""}`}
            >
              {pathname === "/search" ? (
                <>
                  <CompassSVG
                    className={`${styles["app-footer__nav-link-icon"] ?? ""} ${styles["app-footer__nav-link-icon--filled"] ?? ""}`}
                  />
                  <span
                    className={styles["app-footer__nav-link-stroke"]}
                  ></span>
                </>
              ) : (
                <CompassOutlineSVG
                  className={styles["app-footer__nav-link-icon"]}
                />
              )}
            </Link>
          </li>

          <li className={styles["app-footer__list-item"]}>
            <Link
              href="/notifications"
              className={styles["app-footer__nav-link"]}
            >
              {pathname.startsWith("/notifications") ? (
                <>
                  <NotificationsSVG
                    className={`${styles["app-footer__nav-link-icon"] ?? ""} ${styles["app-footer__nav-link-icon--filled"] ?? ""}`}
                  />
                  <span
                    className={styles["app-footer__nav-link-stroke"]}
                  ></span>
                </>
              ) : (
                <NotificationsOutlineSVG
                  className={styles["app-footer__nav-link-icon"]}
                />
              )}
            </Link>
          </li>
          <li className={styles["app-footer__list-item"]}>
            <Link
              href={`/profile/${session.user.id}`}
              className={styles["app-footer__nav-link"]}
            >
              {pathname === `/profile/${session.user.id}` ? (
                <>
                  <PersonSVG
                    className={`${styles["app-footer__nav-link-icon"] ?? ""} ${styles["app-footer__nav-link-icon--filled"] ?? ""}`}
                  />
                  <span
                    className={styles["app-footer__nav-link-stroke"]}
                  ></span>
                </>
              ) : (
                <PersonOutlineSVG
                  className={styles["app-footer__nav-link-icon"]}
                />
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default AppFooter;
