import type { FieldError, UseFormRegisterReturn } from "react-hook-form";
import Select from "../Select/Select";

import styles from "./InputHourlyRate.module.scss";

export default function InputHourlyRate({
  label,
  rate,
  currency,
  onChange,
  fill,
  register,
  error,
}: {
  label?: boolean;
  rate: number;
  currency: string;
  onChange: (rate: number, currency: string) => void;
  fill?: boolean;
  register?: UseFormRegisterReturn;
  error?: FieldError;
}) {
  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles["input-hourly-rate"] ?? ""} ${(label && styles["input-hourly-rate--labeled"]) || ""} ${(error && styles["input-hourly-rate--error"]) || ""} ${(fill && styles["input-hourly-rate--filled"]) || ""}`}
    >
      <div className={styles["input-hourly-rate__container"]}>
        {label && (
          <label
            htmlFor="hourly-rate"
            className={styles["input-hourly-rate__label"]}
          >
            Hourly Rate
          </label>
        )}

        <input
          type="number"
          name="hourly-rate"
          id="hourly-rate"
          value={rate.toString()}
          {...register}
          onChange={(event) => {
            if (event.target.value.length > 10) return;
            onChange(+event.target.value, currency);
            void register?.onChange(event);
          }}
          className={styles["input-hourly-rate__input"]}
        />

        <Select
          options={["₫", "$", "€"]}
          value={currency}
          onChange={(option) => {
            onChange(rate, option);
          }}
          type="hourly-rate"
        />
      </div>

      {error && (
        <p className={styles["input-hourly-rate__error-message"]}>
          {error.message}
        </p>
      )}
    </div>
  );
}
