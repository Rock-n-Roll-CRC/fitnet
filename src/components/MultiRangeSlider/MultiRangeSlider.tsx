import { useCallback, useEffect, useRef } from "react";

import styles from "./MultiRangeSlider.module.scss";

export default function MultiRangeSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: { min: number; max: number };
  onChange: ({ min, max }: { min: number; max: number }) => void;
}) {
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const rangeRef = useRef<HTMLDivElement>(null);

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max],
  );

  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(value.min);
      const maxPercent = getPercent(+maxValRef.current.value);

      if (rangeRef.current) {
        rangeRef.current.style.left = `${minPercent.toString()}%`;
        rangeRef.current.style.inlineSize = `${(maxPercent - minPercent).toString()}%`;
      }
    }
  }, [value.min, getPercent]);

  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(value.max);

      if (rangeRef.current) {
        rangeRef.current.style.inlineSize = `${(maxPercent - minPercent).toString()}%`;
      }
    }
  }, [value.max, getPercent]);

  return (
    <div className={styles["multi-range-slider"]}>
      <input
        type="range"
        min={min}
        max={max}
        value={value.min}
        ref={minValRef}
        onChange={(event) => {
          const newValue = Math.min(+event.target.value, value.max - 1);

          onChange({ min: newValue, max: value.max });
        }}
        className={`${styles["multi-range-slider__thumb"] ?? ""} ${(value.min > max - 100 ? styles["multi-range-slider__thumb--z-index-5"] : styles["multi-range-slider__thumb--min"]) ?? ""}`}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={value.max}
        ref={maxValRef}
        onChange={(event) => {
          const newValue = Math.max(+event.target.value, value.min + 1);

          onChange({ min: value.min, max: newValue });
        }}
        className={`${styles["multi-range-slider__thumb"] ?? ""} ${styles["multi-range-slider__thumb--max"] ?? ""}`}
      />

      <div className={styles["multi-range-slider__track"]}></div>
      <div ref={rangeRef} className={styles["multi-range-slider__range"]}></div>
    </div>
  );
}
