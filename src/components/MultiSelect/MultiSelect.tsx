import { useState } from "react";

import ChevronDownOutlineSVG from "@/assets/icons/chevron-down-outline.svg";
import ChevronUpOutlineSVG from "@/assets/icons/chevron-up-outline.svg";

import styles from "./MultiSelect.module.scss";

export default function MultiSelect<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label?: string;
  options: readonly T[];
  value: T[];
  onChange: (value: T[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const Icon = isOpen ? ChevronUpOutlineSVG : ChevronDownOutlineSVG;

  function handleToggleIsOpen() {
    setIsOpen((isOpen) => !isOpen);
  }

  function handleSelectOption(option: T) {
    onChange(
      value.includes(option)
        ? value.filter((el) => el !== option)
        : [...value, option],
    );
  }

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles.multiselect ?? ""} ${(isOpen && styles["multiselect--open"]) || ""} ${(label && styles["multiselect--labeled"]) || ""}`}
    >
      {label && (
        <label
          htmlFor={label.toLowerCase()}
          onClick={() => {
            handleToggleIsOpen();
          }}
          className={styles.multiselect__label}
        >
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={handleToggleIsOpen}
        className={styles.multiselect__button}
      >
        <p className={styles.multiselect__value}>
          {value.map((val) => (
            <span key={val}>
              {val.replace(/\b\w/g, (c) => c.toUpperCase())}
            </span>
          ))}
        </p>

        <Icon className={styles.multiselect__icon} />
      </button>

      <ul className={styles.multiselect__body}>
        {options.map((option) => (
          <li key={option} className={styles["multiselect__list-item"]}>
            <input
              type="checkbox"
              name={option}
              id={option}
              checked={value.includes(option)}
              onChange={() => {
                handleSelectOption(option);
              }}
            />
            <label htmlFor={option}>
              {option.replace(/\b\w/g, (c) => c.toUpperCase())}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
