"use client";

import { useState } from "react";
import Link from "next/link";

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
        <nav>
          <ul className={styles["hamburger-menu__links-list"]}>
            <li>
              <Link
                href="#features"
                onClick={() => {
                  setIsOpen(false);
                }}
                className={styles["hamburger-menu__link"]}
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="#how-it-works"
                onClick={() => {
                  setIsOpen(false);
                }}
                className={styles["hamburger-menu__link"]}
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href="#testimonials"
                onClick={() => {
                  setIsOpen(false);
                }}
                className={styles["hamburger-menu__link"]}
              >
                Testimonials
              </Link>
            </li>
          </ul>
        </nav>

        <Button type="call-to-action">Get Started</Button>
      </div>
    </div>
  );
};

export default HamburgerMenu;
