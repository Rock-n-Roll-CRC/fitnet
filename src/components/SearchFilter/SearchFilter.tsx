"use client";

import type { Session } from "next-auth";
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
  userCoords,
  setUserCoords,
  filters,
  isOpen,
  setIsOpen,
}: {
  session: Session;
  userCoords: Coordinates;
  setUserCoords: Dispatch<SetStateAction<Coordinates>>;
  filters: {
    distance: number;
    gender: "male" | "female";
    minAge: number;
    maxAge: number;
  };
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [locationRange, setLocationRange] = useState(filters.distance);
  const [gender, setGender] = useState(filters.gender);
  const [minAge, setMinAge] = useState(filters.minAge);
  const [maxAge, setMaxAge] = useState(filters.maxAge);

  const searchParamsReadOnly = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  function handleClick() {
    setIsOpen((isOpen) => !isOpen);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsOpen(false);

    const searchParams = new URLSearchParams(searchParamsReadOnly);

    searchParams.set("distance", locationRange.toString());
    searchParams.set("gender", gender);
    searchParams.set("minAge", minAge.toString());
    searchParams.set("maxAge", maxAge.toString());

    router.replace(`${pathname}/?${searchParams.toString()}`);
  }

  function clearFilters() {
    setLocationRange(50);
    setGender("male");
    setMinAge(18);
    setMaxAge(100);
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

            <div
              id="gender"
              defaultValue={searchParamsReadOnly.get("gender") ?? "male"}
              className={styles["search-filter__button-group"]}
            >
              <button
                value="male"
                type="button"
                onClick={() => {
                  setGender("male");
                }}
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                className={`${styles["search-filter__option-button"] ?? ""} ${(gender === "male" && styles["search-filter__option-button--selected"]) || ""}`}
              >
                Man
              </button>
              <button
                value="female"
                type="button"
                onClick={() => {
                  setGender("female");
                }}
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                className={`${styles["search-filter__option-button"] ?? ""} ${(gender === "female" && styles["search-filter__option-button--selected"]) || ""}`}
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
        </div>

        <button className={styles["search-filter__submit-button"]}>
          Show coaches
        </button>
      </form>
    </div>
  );
};

export default SearchFilter;
