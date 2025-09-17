"use client";

import { useState } from "react";

import ChevronDownOutlineSVG from "@/assets/icons/chevron-down-outline.svg";
import ChevronUpOutlineSVG from "@/assets/icons/chevron-up-outline.svg";

import styles from "./Select.module.scss";
import type { UseFormRegisterReturn } from "react-hook-form";

export default function Select<T extends string>({
  label,
  options,
  value,
  onChange,
  type,
  fill,
  register,
}: {
  label?: string;
  options: readonly T[];
  value: T;
  onChange: (option: T) => void;
  type?: "hourly-rate";
  fill?: boolean;
  register?: UseFormRegisterReturn;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const Icon = isOpen ? ChevronUpOutlineSVG : ChevronDownOutlineSVG;

  function handleToggleIsOpen() {
    setIsOpen((isOpen) => !isOpen);
  }

  function handleSelectOption(option: T) {
    setIsOpen(false);
    onChange(option);
    void register?.onChange({ target: { name: register.name, value: option } });
  }

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles.select ?? ""} ${(isOpen && styles["select--open"]) || ""} ${(type && styles["select--type-hourly-rate"]) || ""} ${(label && styles["select--labeled"]) || ""} ${(fill && styles["select--filled"]) || ""}`}
    >
      {label && (
        <label
          onClick={() => {
            handleToggleIsOpen();
          }}
          className={styles.select__label}
        >
          {label}
        </label>
      )}

      <input type="text" value={value} {...register} readOnly hidden />

      <button
        type="button"
        onClick={handleToggleIsOpen}
        className={styles.select__button}
      >
        {value.replace(/\b\w/g, (c) => c.toUpperCase())}

        <Icon className={styles.select__icon} />
      </button>

      <ul className={styles.select__body}>
        {options.map((option) => (
          <li key={option} className={styles["select__list-item"]}>
            <button
              type="button"
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
