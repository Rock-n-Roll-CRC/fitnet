import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import { useState } from "react";
import Image from "next/image";

import RatingSet from "@/components/RatingSet/RatingSet";

import { postReview } from "@/services/actions";

import CloseOutlineSVG from "@/assets/icons/close-outline.svg";

import styles from "./ReviewModal.module.scss";
import toast from "react-hot-toast";

export default function ReviewModal({
  session,
  rateeProfile,
  onClose,
  isOpen,
}: {
  session: Session;
  rateeProfile: Tables<"profiles">;
  onClose: () => void;
  isOpen: boolean;
}) {
  const [rating, setRating] = useState<number>();
  const [text, setText] = useState("");

  async function handlePost() {
    if (!rating) return;

    onClose();
    try {
      await postReview(session.user.id, rateeProfile.user_id, rating, text);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  }

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles["review-modal"] ?? ""} ${(isOpen && styles["review-modal--open"]) || ""}`}
    >
      <div className={styles["review-modal__heading-container"]}>
        <h2 className={styles["review-modal__heading"]}>Rate and Review</h2>

        <button onClick={onClose} className={styles["review-modal__button"]}>
          <CloseOutlineSVG className={styles["review-modal__button-icon"]} />
        </button>
      </div>

      <div className={styles["review-modal__ratee-overview"]}>
        <div className={styles["review-modal__ratee-image-wrapper"]}>
          <Image
            src={rateeProfile.avatar_url}
            alt={rateeProfile.full_name}
            fill
            className={styles["review-modal__ratee-image"]}
          />
        </div>

        <p className={styles["review-modal__ratee-name"]}>
          {rateeProfile.full_name}
        </p>
      </div>

      <div className={styles["review-modal__rating-container"]}>
        <p className={styles["review-modal__label"]}>Tap a star to rate it!</p>

        <div className={styles["review-modal__star-container"]}>
          <RatingSet rating={rating} setRating={setRating} />

          <div className={styles["review-modal__star-details"]}>
            {rating ?? "-"} stars
          </div>
        </div>
      </div>

      <div className={styles["review-modal__text-container"]}>
        <p className={styles["review-modal__label"]}>Review your experience</p>

        <textarea
          name=""
          id=""
          value={text}
          onChange={(event) => {
            setText(event.target.value);
          }}
          className={styles["review-modal__text"]}
        ></textarea>
      </div>

      <button
        onClick={() => {
          void handlePost();
        }}
        className={styles["review-modal__post-button"]}
      >
        Post Review
      </button>
    </div>
  );
}
