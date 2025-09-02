import Link from "next/link";

import ArrowBackOutlineSVG from "@/assets/icons/arrow-back-outline.svg";

import styles from "./ProfileHeader.module.scss";

export default function ProfileHeader() {
  return (
    <header className={styles["profile-header"]}>
      <Link href="/search" className={styles["profile-header__button"]}>
        <ArrowBackOutlineSVG className={styles["profile-header__icon"]} />
      </Link>

      <h1 className={styles["profile-header__heading"]}>Profile</h1>
    </header>
  );
}
