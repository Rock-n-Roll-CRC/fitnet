import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import Link from "next/link";

import ProfileMenu from "@/components/ProfileMenu/ProfileMenu";

import ArrowBackOutlineSVG from "@/assets/icons/arrow-back-outline.svg";

import styles from "./ProfileHeader.module.scss";

export default function ProfileHeader({
  session,
  profile,
}: {
  session: Session;
  profile: Tables<"profiles">;
}) {
  return (
    <header className={styles["profile-header"]}>
      <Link href="/search" className={styles["profile-header__button"]}>
        <ArrowBackOutlineSVG className={styles["profile-header__icon"]} />
      </Link>

      <h1 className={styles["profile-header__heading"]}>Profile</h1>
    </header>
  );
}
