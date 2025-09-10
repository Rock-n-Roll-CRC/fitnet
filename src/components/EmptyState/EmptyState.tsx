import type { FC, ReactNode, SVGProps } from "react";

import Link from "next/link";

import styles from "./EmptyState.module.scss";

export default function EmptyState({
  illustration: Illustration,
  illustrationType,
  heading,
  description,
  ctaText,
  ctaLink,
}: {
  illustration: FC<SVGProps<SVGElement>>;
  illustrationType?: "shorter" | "short";
  heading: ReactNode;
  description: ReactNode;
  ctaText?: ReactNode;
  ctaLink?: string;
}) {
  return (
    <div className={styles["empty-state"]}>
      <Illustration
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        className={`${styles["empty-state__illustration"] ?? ""} ${(illustrationType && styles[`empty-state__illustration--${illustrationType}`]) || ""}`}
      />

      <div className={styles["empty-state__body"]}>
        <div className={styles["empty-state__content"]}>
          <p className={styles["empty-state__heading"]}>{heading}</p>
          <p className={styles["empty-state__description"]}>{description}</p>
        </div>

        {ctaText && (
          <Link
            href={ctaLink ?? "/search"}
            className={styles["empty-state__cta"]}
          >
            {ctaText}
          </Link>
        )}
      </div>
    </div>
  );
}
