import type { Dispatch, SetStateAction } from "react";
import type { Tables } from "@/types/database";

import InputCity from "@/components/InputCity/InputCity";
import InputDate from "@/components/InputDate/InputDate";
import MultiSelect from "@/components/MultiSelect/MultiSelect";

import LocationOutlineSVG from "@/assets/icons/location-outline.svg";
import CashOutlineSVG from "@/assets/icons/cash-outline.svg";
import MaleOutlineSVG from "@/assets/icons/male-outline.svg";
import FemaleOutlineSVG from "@/assets/icons/female-outline.svg";
import BarbellOutlineSVG from "@/assets/icons/barbell-outline.svg";
import SparklesOutlineSVG from "@/assets/icons/sparkles-outline.svg";

import { calculateAge } from "@/utilities/helpers";

import styles from "./ProfileDetails.module.scss";
import Select from "../Select/Select";

export default function ProfileDetails({
  profile,
  isEditing,
  editedProfile,
  setEditedProfile,
}: {
  profile: Tables<"profiles"> & {
    ratings: Tables<"ratings">[];
  };
  isEditing: boolean;
  editedProfile: Tables<"profiles">;
  setEditedProfile: Dispatch<SetStateAction<Tables<"profiles">>>;
}) {
  return (
    <div className={styles["profile-details"]}>
      <div className={styles["profile-details__detail"]}>
        <div className={styles["profile-details__detail-label-box"]}>
          <LocationOutlineSVG
            className={styles["profile-details__detail-icon"]}
          />
          <p className={styles["profile-details__detail-label"]}>City</p>
        </div>
        {isEditing ? (
          <InputCity
            editedProfile={editedProfile}
            setEditedProfile={setEditedProfile}
          />
        ) : (
          <p className={styles["profile-details__detail-value"]}>
            {profile.city}
          </p>
        )}
      </div>

      {profile.role === "coach" ? (
        <>
          <div className={styles["profile-details__detail"]}>
            <div className={styles["profile-details__detail-label-box"]}>
              <CashOutlineSVG
                className={styles["profile-details__detail-icon"]}
              />
              <p className={styles["profile-details__detail-label"]}>
                Hourly Rate
              </p>
            </div>
            {isEditing ? (
              <p>test</p>
            ) : (
              <p className={styles["profile-details__detail-value"]}>
                {profile.hourly_rate} {profile.hourly_rate_currency}/h
              </p>
            )}
          </div>

          <div className={styles["profile-details__detail"]}>
            <div className={styles["profile-details__detail-label-box"]}>
              <BarbellOutlineSVG
                className={styles["profile-details__detail-icon"]}
              />
              <p className={styles["profile-details__detail-label"]}>
                Expertise
              </p>
            </div>
            {isEditing ? (
              <MultiSelect
                options={["muscle growth", "weight loss", "yoga"]}
                defaultValue={profile.expertise}
                onSelect={(val) => {
                  setEditedProfile((editedProfile) => ({
                    ...editedProfile,
                    expertise: val.length > 0 ? val : profile.expertise,
                  }));
                }}
              />
            ) : (
              <p className={styles["profile-details__detail-value"]}>
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
          <div className={styles["profile-details__detail"]}>
            <div className={styles["profile-details__detail-label-box"]}>
              <BarbellOutlineSVG
                className={styles["profile-details__detail-icon"]}
              />
              <p className={styles["profile-details__detail-label"]}>
                Fitness Goal
              </p>
            </div>
            {isEditing ? (
              <Select
                options={["muscle growth", "weight loss", "yoga"]}
                defaultValue={profile.fitness_goal}
                onSelect={(fitnessGoal) => {
                  setEditedProfile({
                    ...editedProfile,
                    fitness_goal: fitnessGoal,
                  });
                }}
              />
            ) : (
              <p className={styles["profile-details__detail-value"]}>
                {profile.fitness_goal?.replace(/\b\w/g, (c) =>
                  c.toUpperCase(),
                ) ?? "Not specified"}
              </p>
            )}
          </div>
        </>
      )}

      <div className={styles["profile-details__detail"]}>
        <div className={styles["profile-details__detail-label-box"]}>
          {profile.gender === "male" ? (
            <MaleOutlineSVG
              className={styles["profile-details__detail-icon"]}
            />
          ) : (
            <FemaleOutlineSVG
              className={styles["profile-details__detail-icon"]}
            />
          )}
          <p className={styles["profile-details__detail-label"]}>Gender</p>
        </div>
        {isEditing ? (
          <Select
            options={["male", "female"]}
            defaultValue={profile.gender}
            onSelect={(gender) => {
              setEditedProfile({
                ...editedProfile,
                gender,
              });
            }}
          />
        ) : (
          <p className={styles["profile-details__detail-value"]}>
            {profile.gender === "male" ? "Man" : "Woman"}
          </p>
        )}
      </div>

      <div className={styles["profile-details__detail"]}>
        <div className={styles["profile-details__detail-label-box"]}>
          <SparklesOutlineSVG
            className={styles["profile-details__detail-icon"]}
          />
          <p className={styles["profile-details__detail-label"]}>
            {isEditing ? "Birthdate" : "Age"}
          </p>
        </div>
        {isEditing ? (
          <InputDate
            defaultValue={profile.birthdate}
            onChange={(date: Date) => {
              setEditedProfile({
                ...editedProfile,
                birthdate: date.toDateString(),
              });
            }}
          />
        ) : (
          <p className={styles["profile-details__detail-value"]}>
            {`${calculateAge(new Date(profile.birthdate))} years old`}
          </p>
        )}
      </div>
    </div>
  );
}
