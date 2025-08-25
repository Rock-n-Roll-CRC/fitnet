import { useState } from "react";

import styles from "./InputDate.module.scss";

export default function InputDate({
  defaultValue,
  onChange,
}: {
  defaultValue: string;
  onChange: (date: Date) => void;
}) {
  const [currValue, setCurrValue] = useState(defaultValue);

  return (
    <input
      type="date"
      name="date"
      id="date"
      value={currValue}
      onChange={(event) => {
        setCurrValue(event.target.value);
        onChange(new Date(event.target.value));
      }}
      className={styles["input-date"]}
    />
  );
}
