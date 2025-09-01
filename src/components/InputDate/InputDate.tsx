import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

import styles from "./InputDate.module.scss";

export default function InputDate({
  label,
  register,
  error,
  value,
  onChange,
  fill,
}: {
  label?: string;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  value: string;
  onChange: (date: string) => void;
  fill?: boolean;
}) {
  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles["input-date"] ?? ""} ${(label && styles["input-date--labeled"]) || ""} ${(error && styles["input-date--error"]) || ""} ${(fill && styles["input-date--filled"]) || ""}`}
    >
      <div className={styles["input-date__container"]}>
        {label && (
          <label
            htmlFor={label.toLowerCase()}
            className={styles["input-date__label"]}
          >
            {label}
          </label>
        )}

        <input
          type="date"
          id={label?.toLowerCase()}
          value={value}
          {...register}
          onChange={(event) => {
            onChange(event.target.value);
            void register?.onChange(event);
          }}
          className={styles["input-date__input"]}
        />
      </div>

      {error && (
        <p className={styles["input-date__error-message"]}>{error.message}</p>
      )}
    </div>
  );
}
