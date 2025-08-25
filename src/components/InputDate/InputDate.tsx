import styles from "./InputDate.module.scss";

export default function InputDate({
  value,
  onChange,
}: {
  value: string;
  onChange: (date: string) => void;
}) {
  return (
    <input
      type="date"
      name="date"
      id="date"
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
      className={styles["input-date"]}
    />
  );
}
