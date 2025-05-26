"use client";

import { useState } from "react";

import NavigationList from "@/components/NavigationList/NavigationList";
import Button from "@/components/Button/Button";

import MenuSVG from "@/assets/icons/menu-outline.svg";

import styles from "./HamburgerMenu.module.scss";

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  function handleToggleMenu() {
    setIsOpen((isOpen) => !isOpen);
  }

  return (
    <div
      className={`${styles["hamburger-menu"] ?? ""} ${isOpen ? (styles["hamburger-menu--open"] ?? "") : ""}`}
    >
      <button
        className={styles["hamburger-menu__button"]}
        onClick={handleToggleMenu}
      >
        {<MenuSVG className={styles["hamburger-menu__icon"]} />}
      </button>

      <div className={styles["hamburger-menu__body"]}>
        <NavigationList
          location="hamburger-menu"
          linkOnClick={() => {
            setIsOpen(false);
          }}
        />

        <Button type="call-to-action">Get Started</Button>
      </div>
    </div>
  );
};

export default HamburgerMenu;
