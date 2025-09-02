import type { Tables } from "@/types/database";

import { useState } from "react";
import Image from "next/image";

import Rating from "@/components/Rating/Rating";

import styles from "./Review.module.scss";

export default function Review({
  review,
}: {
  review: Tables<"reviews"> & { raterProfile: Tables<"profiles"> };
}) {
  const [isOpen, setIsOpen] = useState(false);

  const displayedContent =
    !isOpen && review.content && review.content.length > 150
      ? review.content.slice(0, 150).concat("...")
      : review.content;

  function handleToggleIsOpen() {
    setIsOpen((isOpen) => !isOpen);
  }

  return (
    <div className={styles.review}>
      <div className={styles["review__top-container"]}>
        <div className={styles["review__image-wrapper"]}>
          <Image
            src={review.raterProfile.avatar_url}
            alt={review.raterProfile.full_name}
            fill
            className={styles.review__image}
          />
        </div>

        <div className={styles["review__detail-container"]}>
          <p className={styles.review__author}>
            {review.raterProfile.full_name}
          </p>

          <Rating ratings={[review]} type="single" />

          <p className={styles.review__date}>
            {new Date(review.created_at).toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {displayedContent && displayedContent.length > 0 && (
        <div className={styles["review__bottom-container"]}>
          <p className={styles.review__content}>{displayedContent}</p>

          {displayedContent.length > 150 && (
            <button
              onClick={handleToggleIsOpen}
              className={styles.review__button}
            >
              {isOpen ? "Read less" : "Read more"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
