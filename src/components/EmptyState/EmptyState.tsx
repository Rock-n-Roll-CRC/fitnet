import type { FC, ReactNode, SVGProps } from "react";

import Link from "next/link";

import styles from "./EmptyState.module.scss";

export default function EmptyState({
  illustration: Illustration,
  heading,
  description,
  ctaText,
}: {
  illustration: FC<SVGProps<SVGElement>>;
  heading: ReactNode;
  description: ReactNode;
  ctaText?: ReactNode;
}) {
  return (
    <div className={styles["empty-state"]}>
      <Illustration className={styles["empty-state__illustration"]} />

      <div className={styles["empty-state__body"]}>
        <div className={styles["empty-state__content"]}>
          <p className={styles["empty-state__heading"]}>{heading}</p>
          <p className={styles["empty-state__description"]}>{description}</p>
        </div>

        {ctaText && (
          <Link href="/search" className={styles["empty-state__cta"]}>
            {ctaText}
          </Link>
        )}
      </div>
    </div>
  );
}
