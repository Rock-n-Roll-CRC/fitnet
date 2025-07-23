"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import PeopleOutlineSVG from "@/assets/icons/people-outline.svg";
import CompassOutlineSVG from "@/assets/icons/compass-outline.svg";
import PersonOutlineSVG from "@/assets/icons/person-outline.svg";
import PeopleSVG from "@/assets/icons/people.svg";
import CompassSVG from "@/assets/icons/compass.svg";
import PersonSVG from "@/assets/icons/person.svg";
import ChatboxEllipsesSVG from "@/assets/icons/chatbox-ellipses.svg";
import ChatboxEllipsesOutlineSVG from "@/assets/icons/chatbox-ellipses-outline.svg";

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
              href="/connections"
              className={styles["app-footer__nav-link"]}
            >
              {pathname.startsWith("/connections") ? (
                <PeopleSVG className={styles["app-footer__nav-link-icon"]} />
              ) : (
                <PeopleOutlineSVG
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
                <CompassSVG className={styles["app-footer__nav-link-icon"]} />
              ) : (
                <CompassOutlineSVG
                  className={styles["app-footer__nav-link-icon"]}
                />
              )}
            </Link>
          </li>
          <li className={styles["app-footer__list-item"]}>
            <Link href={`/messages`} className={styles["app-footer__nav-link"]}>
              {pathname === `/messages` ? (
                <ChatboxEllipsesSVG
                  className={styles["app-footer__nav-link-icon"]}
                />
              ) : (
                <ChatboxEllipsesOutlineSVG
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
                <PersonSVG className={styles["app-footer__nav-link-icon"]} />
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
