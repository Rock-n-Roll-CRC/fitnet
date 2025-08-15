"use client";

import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import Link from "next/link";
import Image from "next/image";

import ConnectButton from "@/components/ConnectButton/ConnectButton";

import styles from "./NearbyCoachesList.module.scss";
import { calculateAge } from "@/utilities/helpers";
import { useOnlineUsers } from "@/hooks/useOnlineUsers";
import Rating from "@/components/Rating/Rating";
import CashOutlineSVG from "@/assets/icons/cash-outline.svg";
import LocationOutlineSVG from "@/assets/icons/location-outline.svg";
import { getAddressByCoords, getCityByCoords } from "@/services/apiLocation";
import { useEffect, useState } from "react";
import OpenOutlineSVG from "@/assets/icons/open-outline.svg";
import FeelingLonelySVG from "@/assets/illustrations/feeling-lonely.svg";

export default function NearbyCoachesList({
  session,
  coaches,
  selectedCoach,
  blockedCoaches,
}: {
  session: Session;
  coaches: (Tables<"profiles"> & { ratings: Tables<"ratings">[] })[];
  selectedCoach: Tables<"profiles">;
  blockedCoaches: (Tables<"blocked_profiles"> & {
    blockerProfile: Tables<"profiles">;
    blockedProfile: Tables<"profiles">;
  })[];
}) {
  const onlineUsers = useOnlineUsers();
  const [addresses, setAddresses] = useState<Record<string, string>>();

  useEffect(() => {
    if (!coaches.length) return;

    async function fetchAll() {
      const entries = await Promise.all(
        coaches.map(async (coach) => {
          const address = await getCityByCoords(
            coach.location as { lat: number; lng: number },
          );
          return [coach.user_id, address ?? "Unknown location"] as const;
        }),
      );
      setAddresses(Object.fromEntries(entries));
    }

    void fetchAll();
  }, [coaches]);

  return (
    <div className={styles["nearby-coaches-list"]}>
      {coaches.length > 0 ? (
        <>
          <div className={styles["nearby-coaches-list__count-box"]}>
            <p className={styles["nearby-coaches-list__count-label"]}>
              Coaches in the area
            </p>

            <div className={styles["nearby-coaches-list__count-body"]}>
              <ul className={styles["nearby-coaches-list__count-list"]}>
                {coaches.length > 4
                  ? coaches
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
                  : coaches.map((coach) => (
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
              {coaches.length > 4 && <p>+{coaches.length - 4}</p>}
            </div>
          </div>

          <ul className={styles["nearby-coaches-list__list"]}>
            {coaches.map((coach) => (
              <div
                key={coach.user_id}
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                className={`${styles["nearby-coaches-list__coach"] ?? ""} ${(onlineUsers.includes(coach.user_id) && styles["nearby-coaches-list__coach--online"]) || ""}`}
              >
                <div className={styles["nearby-coaches-list__coach-body"]}>
                  <div
                    className={styles["nearby-coaches-list__coach-info-box"]}
                  >
                    <p className={styles["nearby-coaches-list__coach-name"]}>
                      {coach.full_name}
                    </p>
                    <div
                      className={
                        styles["nearby-coaches-list__coach-rating-box"]
                      }
                    >
                      <Rating ratings={coach.ratings} />
                    </div>
                    <div className={styles["nearby-coaches-list__details-box"]}>
                      <div className={styles["nearby-coaches-list__detail"]}>
                        <LocationOutlineSVG
                          className={styles["nearby-coaches-list__detail-icon"]}
                        />
                        <p
                          className={
                            styles["nearby-coaches-list__detail-value"]
                          }
                        >
                          {addresses?.[coach.user_id]}
                        </p>
                      </div>
                      <div className={styles["nearby-coaches-list__detail"]}>
                        <CashOutlineSVG
                          className={styles["nearby-coaches-list__detail-icon"]}
                        />
                        <p
                          className={
                            styles["nearby-coaches-list__detail-value"]
                          }
                        >
                          {coach.hourly_rate} {coach.hourly_rate_currency}/h
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={styles["nearby-coaches-list__phone-box"]}>
                    <p className={styles["nearby-coaches-list__phone"]}>
                      {coach.phone_number}
                    </p>
                  </div>
                </div>

                <div className={styles["nearby-coaches-list__image-wrapper"]}>
                  <Image
                    src={coach.avatar_url}
                    alt={coach.full_name}
                    width={250}
                    height={250}
                    className={styles["nearby-coaches-list__coach-image"]}
                    quality={100}
                  />
                  <Link
                    href={`/profile/${coach.user_id}`}
                    className={styles["nearby-coaches-list__image-link"]}
                  >
                    <OpenOutlineSVG
                      className={styles["nearby-coaches-list__image-icon"]}
                    />
                  </Link>
                </div>
              </div>
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
