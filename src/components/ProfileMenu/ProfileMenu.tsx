"use client";

import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import { useState } from "react";
import Link from "next/link";

import EllipsisHorizontalSVG from "@/assets/icons/ellipsis-horizontal.svg";

import { clearMessages } from "@/services/actions";

import styles from "./ProfileMenu.module.scss";

export default function ProfileMenu({
  session,
  profile,
}: {
  session: Session;
  profile: Tables<"profiles">;
}) {
  const [isOpen, setIsOpen] = useState(false);

  function handleClick() {
    setIsOpen((isOpen) => !isOpen);
  }

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles["profile-menu"] ?? ""} ${(isOpen && styles["profile-menu--visible"]) || ""} `}
    >
      <button onClick={handleClick} className={styles["profile-menu__button"]}>
        <EllipsisHorizontalSVG className={styles["profile-menu__icon"]} />
      </button>

      <div className={styles["profile-menu__body"]}>
        {session.user.id === profile.user_id ? (
          <Link
            href="/profile/edit"
            className={styles["profile-menu__menu-button"]}
          >
            Edit profile
          </Link>
        ) : (
          <button
            onClick={() => {
              void clearMessages();
              handleClick();
            }}
            className={`${styles["profile-menu__menu-button"] ?? ""} ${styles["profile-menu__menu-button--red"] ?? ""} `}
          >
            Block profile
          </button>
        )}

        <button
          onClick={handleClick}
          className={styles["profile-menu__menu-button"]}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
