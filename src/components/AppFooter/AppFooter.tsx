"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import PeopleOutlineSVG from "@/assets/icons/people-outline.svg";
import SearchOutlineSVG from "@/assets/icons/search-outline.svg";
import PersonOutlineSVG from "@/assets/icons/person-outline.svg";
import PeopleSVG from "@/assets/icons/people.svg";
import SearchSVG from "@/assets/icons/search.svg";
import PersonSVG from "@/assets/icons/person.svg";

import styles from "./AppFooter.module.scss";

const AppFooter = () => {
  const pathname = usePathname();

  return (
    <footer className={styles["app-footer"]}>
      <nav className={styles["app-footer__nav"]}>
        <ul className={styles["app-footer__list"]}>
          <li className={styles["app-footer__list-item"]}>
            <Link href="/coaches" className={styles["app-footer__nav-link"]}>
              {pathname === "/coaches" ? (
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
                <SearchSVG className={styles["app-footer__nav-link-icon"]} />
              ) : (
                <SearchOutlineSVG
                  className={styles["app-footer__nav-link-icon"]}
                />
              )}
            </Link>
          </li>
          <li className={styles["app-footer__list-item"]}>
            <Link href="/profile" className={styles["app-footer__nav-link"]}>
              {pathname === "/profile" ? (
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
