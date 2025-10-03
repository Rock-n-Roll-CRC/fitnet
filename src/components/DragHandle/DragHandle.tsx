import type { TouchEventHandler } from "react";

import styles from "./DragHandle.module.scss";

export default function DragHandle({
  onTouchStart,
  onTouchMove,
  onTouchEnd,
}: {
  onTouchStart: TouchEventHandler;
  onTouchMove: TouchEventHandler;
  onTouchEnd: TouchEventHandler;
}) {
  return (
    <div
      className={styles["drag-handle"]}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <button className={styles["drag-handle__button"]}>
        <span className={styles["drag-handle__handle"]}></span>
      </button>
    </div>
  );
}
