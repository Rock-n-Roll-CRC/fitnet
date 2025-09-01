import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

import styles from "./InputTel.module.scss";

export default function InputTel({
  label,
  register,
  error,
  value,
  onChange,
}: {
  label?: boolean;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles["input-tel"] ?? ""} ${(label && styles["input-tel--labeled"]) || ""} ${(error && styles["input-tel--error"]) || ""}`}
    >
      <div className={styles["input-tel__container"]}>
        {label && (
          <label htmlFor="phone-number" className={styles["input-tel__label"]}>
            Phone No.
          </label>
        )}

        <input
          type="tel"
          id="phone-number"
          value={value}
          {...register}
          onChange={(event) => {
            onChange(event.target.value);
            void register?.onChange(event);
          }}
          className={styles["input-tel__input"]}
        />
      </div>

      {error && (
        <p className={styles["input-tel__error-message"]}>{error.message}</p>
      )}
    </div>
  );
}
