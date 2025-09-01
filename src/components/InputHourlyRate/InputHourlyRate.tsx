import Select from "../Select/Select";

import styles from "./InputHourlyRate.module.scss";

export default function InputHourlyRate({
  label,
  rate,
  currency,
  onChange,
  fill,
}: {
  label?: boolean;
  rate: number;
  currency: string;
  onChange: (rate: number, currency: string) => void;
  fill?: boolean;
}) {
  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles["input-hourly-rate"] ?? ""} ${(label && styles["input-hourly-rate--labeled"]) || ""} ${(fill && styles["input-hourly-rate--filled"]) || ""}`}
    >
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
        value={rate}
        onChange={(event) => {
          onChange(+event.target.value, currency);
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
  );
}
