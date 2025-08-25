import { useState } from "react";

import ChevronDownOutlineSVG from "@/assets/icons/chevron-down-outline.svg";
import ChevronUpOutlineSVG from "@/assets/icons/chevron-up-outline.svg";

import styles from "./MultiSelect.module.scss";

export default function MultiSelect({
  options,
  defaultValue,
  onSelect,
}: {
  options: string[];
  defaultValue?: string[] | null;
  onSelect: (value: string[]) => void;
}) {
  const [currValue, setCurValue] = useState<string[]>(defaultValue ?? []);
  const [isOpen, setIsOpen] = useState(false);

  const Icon = isOpen ? ChevronUpOutlineSVG : ChevronDownOutlineSVG;

  function handleToggleIsOpen() {
    setIsOpen((isOpen) => !isOpen);
  }

  function handleSelectOption(option: string) {
    setCurValue((currValue) =>
      currValue.includes(option)
        ? currValue.filter((el) => el !== option)
        : [...currValue, option],
    );
    onSelect(currValue);
  }

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles.multiselect ?? ""} ${(isOpen && styles["multiselect--open"]) || ""}`}
    >
      <button
        onClick={handleToggleIsOpen}
        className={styles.multiselect__button}
      >
        <p className={styles.multiselect__value}>
          {currValue.map((val) => (
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
              checked={currValue.includes(option)}
              onChange={(event) => {
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
