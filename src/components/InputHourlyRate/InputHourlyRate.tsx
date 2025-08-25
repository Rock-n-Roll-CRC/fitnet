import Select from "../Select/Select";

import styles from "./InputHourlyRate.module.scss";

export default function InputHourlyRate({
  rate,
  currency,
  onChange,
}: {
  rate: number;
  currency: string;
  onChange: (rate: number, currency: string) => void;
}) {
  return (
    <div className={styles["input-hourly-rate"]}>
      <input
        type="number"
        name=""
        id=""
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
