import type { Dispatch, SetStateAction } from "react";

import StarOutlineSVG from "@/assets/icons/star-outline.svg";
import StarSVG from "@/assets/icons/star.svg";

import styles from "./RatingSet.module.scss";

export default function RatingSet({
  rating,
  setRating,
}: {
  rating: number | undefined;
  setRating: Dispatch<SetStateAction<number | undefined>>;
}) {
  return (
    <ul className={styles["rating-set"]}>
      {Array.from({ length: 5 }).map((_, index) => {
        const Icon = rating
          ? index < rating
            ? StarSVG
            : StarOutlineSVG
          : StarOutlineSVG;

        return (
          <li key={index} className={styles["rating-set__list-item"]}>
            <Icon
              onClick={() => {
                setRating(index + 1);
              }}
              className={styles["rating-set__star"]}
            />
          </li>
        );
      })}
    </ul>
  );
}
