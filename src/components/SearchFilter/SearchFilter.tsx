"use client";

import type { Session } from "next-auth";
import type { Tables } from "@/types/database";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { Coordinates } from "@/shared/interfaces/Coordinates.interface";

import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import LocationInput from "@/components/LocationInput/LocationInput";
import RangeSlider from "@/components/RangeSlider/RangeSlider";
import MultiRangeSlider from "@/components/MultiRangeSlider/MultiRangeSlider";

import OptionsSVG from "@/assets/icons/options.svg";

import styles from "./SearchFilter.module.scss";

const SearchFilter = ({
  session,
  userProfile,
  userCoords,
  setUserCoords,
  filters,
  isOpen,
  setIsOpen,
}: {
  session: Session;
  userProfile: Tables<"profiles">;
  userCoords: Coordinates;
  setUserCoords: Dispatch<SetStateAction<Coordinates>>;
  filters: {
    distance: number;
    gender: ("male" | "female")[];
    minAge: number;
    maxAge: number;
    expertise: ("muscle growth" | "weight loss" | "yoga")[];
    fitnessGoal: ("muscle growth" | "weight loss" | "yoga")[];
  };
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [locationRange, setLocationRange] = useState(filters.distance);
  const [gender, setGender] = useState(filters.gender);
  const [minAge, setMinAge] = useState(filters.minAge);
  const [maxAge, setMaxAge] = useState(filters.maxAge);
  const [expertise, setExpertise] = useState(filters.expertise);
  const [fitnessGoal, setFitnessGoal] = useState(filters.fitnessGoal);

  const searchParamsReadOnly = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function handleClick() {
    setIsOpen((isOpen) => !isOpen);

    if (isOpen) onSubmit();
  }

  function onSubmit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    setIsOpen(false);

    const searchParams = new URLSearchParams(searchParamsReadOnly);

    searchParams.set("distance", locationRange.toString());
    searchParams.delete("gender");
    gender.forEach((item) => {
      searchParams.append("gender", item);
    });
    searchParams.set("minAge", minAge.toString());
    searchParams.set("maxAge", maxAge.toString());

    if (userProfile.role === "client") {
      searchParams.delete("expertise");
      expertise.forEach((item) => {
        searchParams.append("expertise", item);
      });
    }

    if (userProfile.role === "coach") {
      searchParams.delete("fitnessGoal");
      fitnessGoal.forEach((item) => {
        searchParams.append("fitnessGoal", item);
      });
    }

    router.replace(`${pathname}/?${searchParams.toString()}`);
  }

  function clearFilters() {
    setLocationRange(100);
    setGender(["male", "female"]);
    setMinAge(18);
    setMaxAge(100);
    setExpertise(["muscle growth", "weight loss", "yoga"]);
    setFitnessGoal(["muscle growth", "weight loss", "yoga"]);
  }

  function handleSelectGender(value: "male" | "female") {
    if (gender.includes(value) && gender.length === 1) return;

    setGender((gender) =>
      gender.includes(value)
        ? gender.filter((gender) => gender !== value)
        : [...gender, value],
    );
  }

  function handleSelectExpertise(
    value: "muscle growth" | "weight loss" | "yoga",
  ) {
    if (expertise.includes(value) && expertise.length === 1) return;

    setExpertise((expertise) =>
      expertise.includes(value)
        ? expertise.filter((expertise) => expertise !== value)
        : [...expertise, value],
    );
  }

  function handleSelectFitnessGoal(
    value: "muscle growth" | "weight loss" | "yoga",
  ) {
    if (fitnessGoal.includes(value) && fitnessGoal.length === 1) return;

    setFitnessGoal((fitnessGoal) =>
      fitnessGoal.includes(value)
        ? fitnessGoal.filter((fitnessGoal) => fitnessGoal !== value)
        : [...fitnessGoal, value],
    );
  }

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles["search-filter"] ?? ""} ${(isOpen && styles["search-filter--open"]) || ""}`}
    >
      <button onClick={handleClick} className={styles["search-filter__button"]}>
        <OptionsSVG className={styles["search-filter__icon"]} />
      </button>

      <form onSubmit={onSubmit} className={styles["search-filter__body"]}>
        <div className={styles["search-filter__big-container"]}>
          <div className={styles["search-filter__top-container"]}>
            <h2 className={styles["search-filter__heading"]}>Filters</h2>

            <button
              type="button"
              onClick={clearFilters}
              className={styles["search-filter__clear-button"]}
            >
              Clear filters
            </button>
          </div>

          <div className={styles["search-filter__input-group-wrapper"]}>
            <LocationInput
              session={session}
              userCoords={userCoords}
              setUserCoords={setUserCoords}
            />

            <span className={styles["search-filter__label"]}>
              Location range | {locationRange}km
            </span>

            <RangeSlider
              min={1}
              max={100}
              value={locationRange}
              onChange={(value) => {
                setLocationRange(value);
              }}
            />
          </div>

          <div className={styles["search-filter__input-group-wrapper"]}>
            <h3 className={styles["search-filter__label"]}>Gender</h3>

            <div id="gender" className={styles["search-filter__button-group"]}>
              <button
                value="male"
                type="button"
                onClick={() => {
                  handleSelectGender("male");
                }}
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                className={`${styles["search-filter__option-button"] ?? ""} ${(gender.includes("male") && styles["search-filter__option-button--selected"]) || ""}`}
              >
                Man
              </button>
              <button
                value="female"
                type="button"
                onClick={() => {
                  handleSelectGender("female");
                }}
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                className={`${styles["search-filter__option-button"] ?? ""} ${(gender.includes("female") && styles["search-filter__option-button--selected"]) || ""}`}
              >
                Woman
              </button>
            </div>
          </div>

          <div className={styles["search-filter__input-group-wrapper"]}>
            <span className={styles["search-filter__label"]}>
              Age range | {minAge} - {maxAge}
            </span>

            <MultiRangeSlider
              min={18}
              max={100}
              value={{ min: minAge, max: maxAge }}
              onChange={({ min, max }) => {
                setMinAge(min);
                setMaxAge(max);
              }}
            />
          </div>

          {userProfile.role === "client" ? (
            <div className={styles["search-filter__input-group-wrapper"]}>
              <h3 className={styles["search-filter__label"]}>Expertise</h3>

              <div
                id="expertise"
                className={styles["search-filter__button-group"]}
              >
                <button
                  value="muscle growth"
                  type="button"
                  onClick={() => {
                    handleSelectExpertise("muscle growth");
                  }}
                  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                  className={`${styles["search-filter__option-button"] ?? ""} ${(expertise.includes("muscle growth") && styles["search-filter__option-button--selected"]) || ""}`}
                >
                  Muscle growth
                </button>
                <button
                  value="weight loss"
                  type="button"
                  onClick={() => {
                    handleSelectExpertise("weight loss");
                  }}
                  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                  className={`${styles["search-filter__option-button"] ?? ""} ${(expertise.includes("weight loss") && styles["search-filter__option-button--selected"]) || ""}`}
                >
                  Weight loss
                </button>
                <button
                  value="yoga"
                  type="button"
                  onClick={() => {
                    handleSelectExpertise("yoga");
                  }}
                  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                  className={`${styles["search-filter__option-button"] ?? ""} ${(expertise.includes("yoga") && styles["search-filter__option-button--selected"]) || ""}`}
                >
                  Yoga
                </button>
              </div>
            </div>
          ) : (
            <div className={styles["search-filter__input-group-wrapper"]}>
              <h3 className={styles["search-filter__label"]}>Fitness Goal</h3>

              <div
                id="fitnessGoal"
                className={styles["search-filter__button-group"]}
              >
                <button
                  value="muscle growth"
                  type="button"
                  onClick={() => {
                    handleSelectFitnessGoal("muscle growth");
                  }}
                  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                  className={`${styles["search-filter__option-button"] ?? ""} ${(fitnessGoal.includes("muscle growth") && styles["search-filter__option-button--selected"]) || ""}`}
                >
                  Muscle growth
                </button>
                <button
                  value="weight loss"
                  type="button"
                  onClick={() => {
                    handleSelectFitnessGoal("weight loss");
                  }}
                  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                  className={`${styles["search-filter__option-button"] ?? ""} ${(fitnessGoal.includes("weight loss") && styles["search-filter__option-button--selected"]) || ""}`}
                >
                  Weight loss
                </button>
                <button
                  value="yoga"
                  type="button"
                  onClick={() => {
                    handleSelectFitnessGoal("yoga");
                  }}
                  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                  className={`${styles["search-filter__option-button"] ?? ""} ${(fitnessGoal.includes("yoga") && styles["search-filter__option-button--selected"]) || ""}`}
                >
                  Yoga
                </button>
              </div>
            </div>
          )}
        </div>

        <button className={styles["search-filter__submit-button"]}>
          Show coaches
        </button>
      </form>
    </div>
  );
};

export default SearchFilter;
