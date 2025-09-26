import Link from "next/link";

import ArrowBackOutlineSVG from "@/assets/icons/arrow-back-outline.svg";

import styles from "./MessagesHeader.module.scss";

export default function MessagesHeader() {
  return (
    <header className={styles["messages-header"]}>
      <Link href="/search" className={styles["messages-header__button"]}>
        <ArrowBackOutlineSVG className={styles["messages-header__icon"]} />
      </Link>

      <h1 className={styles["messages-header__heading"]}>Messages</h1>
    </header>
  );
}
