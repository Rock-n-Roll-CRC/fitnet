import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Review from "@/components/Review/Review";
import ReviewModal from "@/components/ReviewModal/ReviewModal";

import TrendingDownSVG from "@/assets/icons/trending-down-outline.svg";
import TrendingUpSVG from "@/assets/icons/trending-up-outline.svg";
import EmptySVG from "@/assets/illustrations/empty.svg";

import styles from "./ProfileReviews.module.scss";

export default function ProfileReviews({
  session,
  profile,
  myProfile,
  setOptimisticProfile,
  sort,
  currentTab,
}: {
  session: Session;
  profile: Tables<"profiles"> & {
    ratings: (Tables<"reviews"> & {
      raterProfile: Tables<"profiles">;
    })[];
  };
  myProfile: Tables<"profiles"> & {
    ratings: (Tables<"reviews"> & {
      raterProfile: Tables<"profiles">;
    })[];
  };
  setOptimisticProfile: (
    action: Tables<"profiles"> & {
      ratings: (Tables<"reviews"> & {
        raterProfile: Tables<"profiles">;
      })[];
    },
  ) => void;
  sort: string | string[];
  currentTab: string | string[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  const readonlySearchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const sortedReviews = profile.ratings.sort((a, b) =>
    sort === "asc"
      ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      : new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );

  function handleToggleSort() {
    const searchParams = new URLSearchParams(readonlySearchParams);

    searchParams.set("sort", sort === "asc" ? "desc" : "asc");

    router.push(`${pathname}?${searchParams}`);
  }

  return (
    profile.role === "coach" && (
      <div
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        className={`${styles["profile-reviews"] ?? ""} ${(currentTab === "reviews" && styles["profile-reviews--selected"]) || ""}`}
      >
        {profile.ratings.length > 0 ? (
          <>
            <button
              onClick={handleToggleSort}
              className={styles["profile-reviews__button"]}
            >
              Most recent{" "}
              {sort === "desc" ? (
                <TrendingDownSVG
                  className={styles["profile-reviews__button-icon"]}
                />
              ) : (
                <TrendingUpSVG
                  className={styles["profile-reviews__button-icon"]}
                />
              )}
            </button>

            <ul className={styles["profile-reviews__list"]}>
              {sortedReviews.map((review) => (
                <li
                  key={review.id}
                  className={styles["profile-reviews__list-item"]}
                >
                  <Review review={review} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className={styles["profile-reviews__empty-state-box"]}>
            <h2 className={styles["profile-reviews__heading"]}>
              There are no reviews yet!
            </h2>

            <EmptySVG className={styles["profile-reviews__illustration"]} />
          </div>
        )}

        {session.user.id !== profile.user_id && (
          <button
            onClick={() => {
              setIsOpen(true);
            }}
            className={styles["profile-reviews__modal-button"]}
          >
            Write a Review
          </button>
        )}

        <ReviewModal
          session={session}
          rateeProfile={profile}
          raterProfile={myProfile}
          setOptimisticProfile={setOptimisticProfile}
          onClose={() => {
            setIsOpen(false);
          }}
          isOpen={isOpen}
        />
      </div>
    )
  );
}
