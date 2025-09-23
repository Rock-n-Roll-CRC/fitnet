"use client";

import type { Tables } from "@/types/database";

import { startTransition } from "react";
import Image from "next/image";
import Link from "next/link";

import Rating from "@/components/Rating/Rating";

import { useOnlineUsers } from "@/hooks/useOnlineUsers";

import { deleteSavedProfile, unblockProfile } from "@/services/actions";

import { calculateAge } from "@/utilities/helpers";

import LocationOutlineSVG from "@/assets/icons/location-outline.svg";
import CashOutlineSVG from "@/assets/icons/cash-outline.svg";
import OpenOutlineSVG from "@/assets/icons/open-outline.svg";
import MaleOutlineSVG from "@/assets/icons/male-outline.svg";
import FemaleOutlineSVG from "@/assets/icons/female-outline.svg";
import BarbellOutlineSVG from "@/assets/icons/barbell-outline.svg";
import SparklesOutlineSVG from "@/assets/icons/sparkles-outline.svg";

import styles from "./ProfilePreview.module.scss";

export default function ProfilePreview({
  profile,
  type,
  onRemoveProfile,
}: {
  profile: Tables<"profiles"> & {
    ratings: Tables<"reviews">[];
  };
  type?: "saved" | "blocked";
  onRemoveProfile?: (action: string) => void;
}) {
  const onlineUsers = useOnlineUsers();

  async function handleRemoveProfile() {
    startTransition(() => {
      onRemoveProfile?.(profile.user_id);
    });

    await deleteSavedProfile(profile.user_id);
  }

  async function handleUnblockProfile() {
    startTransition(() => {
      onRemoveProfile?.(profile.user_id);
    });

    await unblockProfile(profile.user_id);
  }

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles["profile-preview"] ?? ""} ${(onlineUsers.includes(profile.user_id) && styles["profile-preview--online"]) || ""}`}
    >
      <div className={styles["profile-preview__main-content"]}>
        <div className={styles["profile-preview__body"]}>
          <div className={styles["profile-preview__info-box"]}>
            <p className={styles["profile-preview__name"]}>
              {profile.full_name}
            </p>
            {profile.role === "coach" && (
              <div className={styles["profile-preview__rating-box"]}>
                <Rating ratings={profile.ratings} />
              </div>
            )}
            <div className={styles["profile-preview__details-box"]}>
              <div className={styles["profile-preview__detail"]}>
                <LocationOutlineSVG
                  className={styles["profile-preview__detail-icon"]}
                />
                <p className={styles["profile-preview__detail-value"]}>
                  {profile.city}
                </p>
              </div>
              <div className={styles["profile-preview__detail"]}>
                {profile.role === "coach" ? (
                  <>
                    <CashOutlineSVG
                      className={styles["profile-preview__detail-icon"]}
                    />
                    <p className={styles["profile-preview__detail-value"]}>
                      {new Intl.NumberFormat("fr-FR")
                        .format(profile.hourly_rate as number)
                        .replace(/\u00A0/g, " ")}{" "}
                      {profile.hourly_rate_currency}/h
                    </p>
                  </>
                ) : (
                  <div className={styles["profile-preview__detail"]}>
                    <BarbellOutlineSVG
                      className={styles["profile-preview__detail-icon"]}
                    />
                    <p className={styles["profile-preview__detail-value"]}>
                      {profile.fitness_goal?.replace(/\b\w/g, (c) =>
                        c.toUpperCase(),
                      ) ?? "Not specified"}
                    </p>
                  </div>
                )}
              </div>
              {profile.role === "client" && (
                <div className={styles["profile-preview__detail"]}>
                  <SparklesOutlineSVG
                    className={styles["profile-preview__detail-icon"]}
                  />
                  <p className={styles["profile-preview__detail-value"]}>
                    {`${calculateAge(new Date(profile.birthdate as string)).toString()} years old`}
                  </p>
                </div>
              )}
              {profile.role === "client" &&
                (profile.gender === "male" ? (
                  <div className={styles["profile-preview__detail"]}>
                    <MaleOutlineSVG
                      className={styles["profile-preview__detail-icon"]}
                    />
                    <p className={styles["profile-preview__detail-value"]}>
                      Man
                    </p>
                  </div>
                ) : (
                  <div className={styles["profile-preview__detail"]}>
                    <FemaleOutlineSVG
                      className={styles["profile-preview__detail-icon"]}
                    />
                    <p className={styles["profile-preview__detail-value"]}>
                      Woman
                    </p>
                  </div>
                ))}
            </div>
          </div>

          <div className={styles["profile-preview__phone-box"]}>
            <p className={styles["profile-preview__phone"]}>
              {profile.phone_number}
            </p>
          </div>
        </div>

        <div className={styles["profile-preview__image-wrapper"]}>
          <Image
            src={profile.avatar_url}
            alt={profile.full_name}
            width={250}
            height={250}
            className={styles["profile-preview__image"]}
            quality={100}
          />
          <Link
            href={`/profile/${profile.user_id}`}
            className={styles["profile-preview__image-link"]}
          >
            <OpenOutlineSVG className={styles["profile-preview__image-icon"]} />
          </Link>
        </div>
      </div>

      {type === "saved" && (
        <div className={styles["profile-preview__button-container"]}>
          <Link
            href={`/messages/${profile.user_id}`}
            className={styles["profile-preview__button"]}
          >
            Send a message
          </Link>
          <button
            onClick={() => {
              void handleRemoveProfile();
            }}
            className={`${styles["profile-preview__button"] ?? ""} ${styles["profile-preview__button--danger"] ?? ""}`}
          >
            Remove as a friend
          </button>
        </div>
      )}

      {type === "blocked" && (
        <div className={styles["profile-preview__button-container"]}>
          <button
            onClick={() => {
              void handleUnblockProfile();
            }}
            className={`${styles["profile-preview__button"] ?? ""} ${styles["profile-preview__button--danger"] ?? ""}`}
          >
            Unblock
          </button>
        </div>
      )}
    </div>
  );
}
