"use client";

import { useState } from "react";

import ChevronDownOutlineSVG from "@/assets/icons/chevron-down-outline.svg";
import ChevronUpOutlineSVG from "@/assets/icons/chevron-up-outline.svg";

import styles from "./Select.module.scss";

export default function Select({
  options,
  value,
  onChange,
  type,
}: {
  options: string[];
  value: string;
  onChange: (option: string) => void;
  type?: "hourly-rate";
}) {
  const [isOpen, setIsOpen] = useState(false);

  const Icon = isOpen ? ChevronUpOutlineSVG : ChevronDownOutlineSVG;

  function handleToggleIsOpen() {
    setIsOpen((isOpen) => !isOpen);
  }

  function handleSelectOption(option: string) {
    setIsOpen(false);
    onChange(option);
  }

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles.select ?? ""} ${(isOpen && styles["select--open"]) || ""} ${(type && styles["select--type-hourly-rate"]) || ""}`}
    >
      <button onClick={handleToggleIsOpen} className={styles.select__button}>
        {value.replace(/\b\w/g, (c) => c.toUpperCase())}

        <Icon className={styles.select__icon} />
      </button>

      <ul className={styles.select__body}>
        {options.map((option) => (
          <li key={option} className={styles["select__list-item"]}>
            <button
              onClick={() => {
                handleSelectOption(option);
              }}
              className={styles.select__option}
            >
              {option.replace(/\b\w/g, (c) => c.toUpperCase())}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
