import { useCallback, useEffect, useRef } from "react";

import styles from "./RangeSlider.module.scss";

export default function RangeSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
}) {
  const valueRef = useRef<HTMLInputElement>(null);
  const rangeRef = useRef<HTMLDivElement>(null);

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max],
  );

  useEffect(() => {
    const percent = getPercent(value);

    if (rangeRef.current) {
      rangeRef.current.style.inlineSize = `${percent.toString()}%`;
    }
  }, [getPercent, value]);

  return (
    <div className={styles["range-slider"]}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        ref={valueRef}
        onChange={(event) => {
          onChange(+event.target.value);
        }}
        className={`${styles["range-slider__thumb"] ?? ""} ${(value > max - 100 ? styles["range-slider__thumb--z-index-5"] : styles["range-slider__thumb--min"]) ?? ""}`}
      />

      <div className={styles["range-slider__track"]}></div>
      <div ref={rangeRef} className={styles["range-slider__range"]}></div>
    </div>
  );
}
