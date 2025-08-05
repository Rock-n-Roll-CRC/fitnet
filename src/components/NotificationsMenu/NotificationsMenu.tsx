"use client";

import { useState } from "react";

import EllipsisHorizontalSVG from "@/assets/icons/ellipsis-horizontal.svg";

import { clearNotifications, readAllNotifications } from "@/services/actions";

import styles from "./NotificationsMenu.module.scss";

export default function NotificationsMenu() {
  const [isOpen, setIsOpen] = useState(false);

  function handleClick() {
    setIsOpen((isOpen) => !isOpen);
  }

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles["notifications-menu"] ?? ""} ${(isOpen && styles["notifications-menu--visible"]) || ""} `}
    >
      <button
        onClick={handleClick}
        className={styles["notifications-menu__button"]}
      >
        <EllipsisHorizontalSVG className={styles["notifications-menu__icon"]} />
      </button>

      <div className={styles["notifications-menu__body"]}>
        <button
          onClick={() => {
            void clearNotifications();
            handleClick();
          }}
          className={styles["notifications-menu__menu-button"]}
        >
          Clear All
        </button>
        <button
          onClick={() => {
            void readAllNotifications();
            handleClick();
          }}
          className={styles["notifications-menu__menu-button"]}
        >
          Mark all as read
        </button>
        <button
          onClick={handleClick}
          className={styles["notifications-menu__menu-button"]}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
