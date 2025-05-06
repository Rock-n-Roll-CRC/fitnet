import type { ReactNode } from "react";
import type { StaticImageData } from "next/image";

import Image from "next/image";

import styles from "./QuoteBlock.module.scss";

const QuoteBlock = ({
  authorImage,
  authorName,
  authorPosition,
  children,
}: {
  authorImage?: StaticImageData;
  authorName?: string;
  authorPosition?: string;
  children: ReactNode;
}) => {
  return (
    <article className={styles["quote-block"]}>
      <blockquote className={styles["quote-block__body"]}>
        <p className={styles["quote-block__quote-text"]}>{children}</p>
      </blockquote>

      {authorImage && authorName && authorPosition && (
        <div className={styles["quote-block__author-body"]}>
          <Image
            src={authorImage}
            alt={authorName}
            quality={100}
            className={styles["quote-block__author-image"]}
          />

          <div className={styles["quote-block__author-text-content"]}>
            <span className={styles["quote-block__author-name"]}>
              {authorName}
            </span>
            <span className={styles["quote-block__author-position"]}>
              {authorPosition}
            </span>
          </div>
        </div>
      )}
    </article>
  );
};

export default QuoteBlock;
