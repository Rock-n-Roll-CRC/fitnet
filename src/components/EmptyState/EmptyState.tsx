import type { FC, ReactNode, SVGProps } from "react";

import styles from "./EmptyState.module.scss";

export default function EmptyState({
  illustration: Illustration,
  heading,
  description,
}: {
  illustration: FC<SVGProps<SVGElement>>;
  heading: ReactNode;
  description: ReactNode;
}) {
  return (
    <div className={styles["empty-state"]}>
      <Illustration className={styles["empty-state__illustration"]} />

      <div className={styles["empty-state__content"]}>
        <p className={styles["empty-state__heading"]}>{heading}</p>
        <p className={styles["empty-state__description"]}>{description}</p>
      </div>
    </div>
  );
}
