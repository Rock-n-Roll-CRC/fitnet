"use client";

import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import Image from "next/image";

import ProfilePreview from "@/components/ProfilePreview/ProfilePreview";

import FeelingLonelySVG from "@/assets/illustrations/feeling-lonely.svg";

import styles from "./NearbyCoachesList.module.scss";

export default function NearbyCoachesList({
  session,
  coaches,
  selectedCoach,
  blockedCoaches,
}: {
  session: Session;
  coaches: (Tables<"profiles"> & { ratings: Tables<"reviews">[] })[];
  selectedCoach: Tables<"profiles">;
  blockedCoaches: (Tables<"blocked_profiles"> & {
    blockerProfile: Tables<"profiles">;
    blockedProfile: Tables<"profiles">;
  })[];
}) {
  const displayedCoaches = coaches.filter(
    (coach) =>
      !blockedCoaches.map((el) => el.blocked_id).includes(coach.user_id),
  );

  return (
    <div className={styles["nearby-coaches-list"]}>
      {displayedCoaches.length > 0 ? (
        <>
          <div className={styles["nearby-coaches-list__count-box"]}>
            <p className={styles["nearby-coaches-list__count-label"]}>
              Coaches in the area
            </p>

            <div className={styles["nearby-coaches-list__count-body"]}>
              <ul className={styles["nearby-coaches-list__count-list"]}>
                {displayedCoaches.length > 4
                  ? displayedCoaches
                      .slice(0, 4)
                      .map((coach) => (
                        <Image
                          key={coach.user_id}
                          src={coach.avatar_url}
                          alt={coach.full_name}
                          height={250}
                          width={250}
                          className={styles["nearby-coaches-list__count-image"]}
                        />
                      ))
                  : displayedCoaches.map((coach) => (
                      <Image
                        key={coach.user_id}
                        src={coach.avatar_url}
                        alt={coach.full_name}
                        height={250}
                        width={250}
                        className={styles["nearby-coaches-list__count-image"]}
                      />
                    ))}
              </ul>
              {displayedCoaches.length > 4 && (
                <p>+{displayedCoaches.length - 4}</p>
              )}
            </div>
          </div>

          <ul className={styles["nearby-coaches-list__list"]}>
            {displayedCoaches.map((coach) => (
              <ProfilePreview key={coach.user_id} profile={coach} />
            ))}
          </ul>
        </>
      ) : (
        <div className={styles["nearby-coaches-list__empty-state"]}>
          <p className={styles["nearby-coaches-list__empty-message"]}>
            There are no coaches nearby. Try to adjust the filters!
          </p>

          <FeelingLonelySVG
            className={styles["nearby-coaches-list__empty-illustration"]}
          />
        </div>
      )}
    </div>
  );
}
