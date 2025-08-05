"use client";

import { useState } from "react";

import EllipsisHorizontalSVG from "@/assets/icons/ellipsis-horizontal.svg";

import { clearMessages } from "@/services/actions";

import styles from "./MessagesMenu.module.scss";

export default function MessagesMenu() {
  const [isOpen, setIsOpen] = useState(false);

  function handleClick() {
    setIsOpen((isOpen) => !isOpen);
  }

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles["messages-menu"] ?? ""} ${(isOpen && styles["messages-menu--visible"]) || ""} `}
    >
      <button onClick={handleClick} className={styles["messages-menu__button"]}>
        <EllipsisHorizontalSVG className={styles["messages-menu__icon"]} />
      </button>

      <div className={styles["messages-menu__body"]}>
        <button
          onClick={() => {
            void clearMessages();
            handleClick();
          }}
          className={styles["messages-menu__menu-button"]}
        >
          Clear All
        </button>
        <button
          onClick={handleClick}
          className={styles["messages-menu__menu-button"]}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
