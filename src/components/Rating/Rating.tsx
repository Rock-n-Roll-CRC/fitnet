import type { Tables } from "@/types/database";

import StarOutlineSVG from "@/assets/icons/star-outline.svg";
import StarSVG from "@/assets/icons/star.svg";

import styles from "./Rating.module.scss";

export default function Rating({
  ratings,
  type,
}: {
  ratings: Tables<"reviews">[];
  type?: "single";
}) {
  const averageScore = (
    ratings.reduce((accum, rating) => accum + rating.rating, 0) / ratings.length
  ).toFixed(1);

  return (
    <div className={styles.rating}>
      {ratings.length > 0 ? (
        <>
          <ul className={styles.rating__list}>
            {Array.from({ length: 5 }).map((_, index) => (
              <li key={index}>
                {Math.abs(+averageScore) >= index + 1 ? (
                  <StarSVG className={styles.rating__star} />
                ) : (
                  <StarOutlineSVG className={styles.rating__star} />
                )}
              </li>
            ))}
          </ul>

          {type !== "single" && (
            <p className={styles.rating__score}>
              {averageScore}{" "}
              <span className={styles.rating__count}>({ratings.length})</span>
            </p>
          )}
        </>
      ) : (
        <p className={styles.rating__score}>Not reviewed yet</p>
      )}
    </div>
  );
}
