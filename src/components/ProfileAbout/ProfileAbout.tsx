import type { Dispatch, SetStateAction } from "react";
import type { Tables } from "@/types/database";

import InputCity from "@/components/InputCity/InputCity";
import InputDate from "@/components/InputDate/InputDate";
import MultiSelect from "@/components/MultiSelect/MultiSelect";
import Select from "@/components/Select/Select";
import InputHourlyRate from "@/components/InputHourlyRate/InputHourlyRate";

import LocationOutlineSVG from "@/assets/icons/location-outline.svg";
import CashOutlineSVG from "@/assets/icons/cash-outline.svg";
import MaleOutlineSVG from "@/assets/icons/male-outline.svg";
import FemaleOutlineSVG from "@/assets/icons/female-outline.svg";
import BarbellOutlineSVG from "@/assets/icons/barbell-outline.svg";
import SparklesOutlineSVG from "@/assets/icons/sparkles-outline.svg";

import { calculateAge } from "@/utilities/helpers";

import styles from "./ProfileAbout.module.scss";

export default function ProfileAbout({
  profile,
  isEditing,
  editedProfile,
  setEditedProfile,
}: {
  profile: Tables<"profiles"> & {
    ratings: (Tables<"reviews"> & {
      raterProfile: Tables<"profiles">;
    })[];
  };
  isEditing: boolean;
  editedProfile: Tables<"profiles"> & {
    ratings: (Tables<"reviews"> & {
      raterProfile: Tables<"profiles">;
    })[];
  };
  setEditedProfile: Dispatch<
    SetStateAction<
      Tables<"profiles"> & {
        ratings: (Tables<"reviews"> & {
          raterProfile: Tables<"profiles">;
        })[];
      }
    >
  >;
}) {
  return (
    <div className={styles["profile-about"]}>
      <div className={styles["profile-about__detail"]}>
        <div className={styles["profile-about__detail-label-box"]}>
          <LocationOutlineSVG
            className={styles["profile-about__detail-icon"]}
          />
          <p className={styles["profile-about__detail-label"]}>City</p>
        </div>
        {isEditing ? (
          <InputCity
            value={editedProfile.city}
            onChange={(val: string) => {
              setEditedProfile((editedProfile) => ({
                ...editedProfile,
                city: val,
              }));
            }}
          />
        ) : (
          <p className={styles["profile-about__detail-value"]}>
            {profile.city}
          </p>
        )}
      </div>

      {profile.role === "coach" ? (
        <>
          <div className={styles["profile-about__detail"]}>
            <div className={styles["profile-about__detail-label-box"]}>
              <CashOutlineSVG
                className={styles["profile-about__detail-icon"]}
              />
              <p className={styles["profile-about__detail-label"]}>
                Hourly Rate
              </p>
            </div>
            {isEditing ? (
              <InputHourlyRate
                rate={editedProfile.hourly_rate as number}
                currency={editedProfile.hourly_rate_currency as string}
                onChange={(rate: number, currency: string) => {
                  setEditedProfile((editedProfile) => ({
                    ...editedProfile,
                    hourly_rate: rate,
                    hourly_rate_currency: currency,
                  }));
                }}
              />
            ) : (
              <p className={styles["profile-about__detail-value"]}>
                {new Intl.NumberFormat("fr-FR")
                  .format(profile.hourly_rate as number)
                  .replace(/\u00A0/g, " ")}{" "}
                {profile.hourly_rate_currency}/h
              </p>
            )}
          </div>

          <div className={styles["profile-about__detail"]}>
            <div className={styles["profile-about__detail-label-box"]}>
              <BarbellOutlineSVG
                className={styles["profile-about__detail-icon"]}
              />
              <p className={styles["profile-about__detail-label"]}>Expertise</p>
            </div>
            {isEditing ? (
              <MultiSelect
                options={["muscle growth", "weight loss", "yoga"]}
                value={
                  editedProfile.expertise as (
                    | "muscle growth"
                    | "weight loss"
                    | "yoga"
                  )[]
                }
                onChange={(
                  val: ("muscle growth" | "weight loss" | "yoga")[],
                ) => {
                  setEditedProfile((editedProfile) => ({
                    ...editedProfile,
                    expertise: val.length > 0 ? val : editedProfile.expertise,
                  }));
                }}
              />
            ) : (
              <p className={styles["profile-about__detail-value"]}>
                {profile.expertise?.map((el, i) => (
                  <span key={i}>
                    {el.replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                ))}
              </p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className={styles["profile-about__detail"]}>
            <div className={styles["profile-about__detail-label-box"]}>
              <BarbellOutlineSVG
                className={styles["profile-about__detail-icon"]}
              />
              <p className={styles["profile-about__detail-label"]}>
                Fitness Goal
              </p>
            </div>
            {isEditing ? (
              <Select
                options={["muscle growth", "weight loss", "yoga"]}
                value={
                  editedProfile.fitness_goal as
                    | "muscle growth"
                    | "weight loss"
                    | "yoga"
                }
                onChange={(fitnessGoal) => {
                  setEditedProfile({
                    ...editedProfile,
                    fitness_goal: fitnessGoal,
                  });
                }}
              />
            ) : (
              <p className={styles["profile-about__detail-value"]}>
                {profile.fitness_goal?.replace(/\b\w/g, (c) =>
                  c.toUpperCase(),
                ) ?? "Not specified"}
              </p>
            )}
          </div>
        </>
      )}

      <div className={styles["profile-about__detail"]}>
        <div className={styles["profile-about__detail-label-box"]}>
          {profile.gender === "male" ? (
            <MaleOutlineSVG className={styles["profile-about__detail-icon"]} />
          ) : (
            <FemaleOutlineSVG
              className={styles["profile-about__detail-icon"]}
            />
          )}
          <p className={styles["profile-about__detail-label"]}>Gender</p>
        </div>
        {isEditing ? (
          <Select
            options={["male", "female"]}
            value={editedProfile.gender}
            onChange={(gender) => {
              setEditedProfile({
                ...editedProfile,
                gender,
              });
            }}
          />
        ) : (
          <p className={styles["profile-about__detail-value"]}>
            {profile.gender === "male" ? "Man" : "Woman"}
          </p>
        )}
      </div>

      <div className={styles["profile-about__detail"]}>
        <div className={styles["profile-about__detail-label-box"]}>
          <SparklesOutlineSVG
            className={styles["profile-about__detail-icon"]}
          />
          <p className={styles["profile-about__detail-label"]}>
            {isEditing ? "Birthdate" : "Age"}
          </p>
        </div>
        {isEditing ? (
          <InputDate
            value={editedProfile.birthdate as string}
            onChange={(date: string) => {
              setEditedProfile({
                ...editedProfile,
                birthdate: date,
              });
            }}
          />
        ) : (
          <p className={styles["profile-about__detail-value"]}>
            {`${calculateAge(new Date(profile.birthdate as string)).toString()} years old`}
          </p>
        )}
      </div>
    </div>
  );
}
