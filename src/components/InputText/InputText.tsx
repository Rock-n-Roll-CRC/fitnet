import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

import styles from "./InputText.module.scss";

export default function InputText({
  label,
  register,
  error,
  value,
  onChange,
}: {
  label?: string;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles["input-text"] ?? ""} ${(label && styles["input-text--labeled"]) || ""} ${(error && styles["input-text--error"]) || ""}`}
    >
      <div className={styles["input-text__container"]}>
        {label && (
          <label
            htmlFor={label.toLowerCase()}
            className={styles["input-text__label"]}
          >
            {label}
          </label>
        )}

        <input
          type="text"
          id={label?.toLowerCase()}
          value={value}
          {...register}
          onChange={(event) => {
            onChange(event.target.value);
            void register?.onChange(event);
          }}
          className={styles["input-text__input"]}
        />
      </div>

      {error && (
        <p className={styles["input-text__error-message"]}>{error.message}</p>
      )}
    </div>
  );
}
