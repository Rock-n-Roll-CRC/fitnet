"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import styles from "./SearchFilter.module.scss";
import { useState } from "react";
import OptionsSVG from "@/assets/icons/options.svg";
import LocationOutlineSVG from "@/assets/icons/location-outline.svg";
import MultiRangeSlider from "../MultiRangeSlider/MultiRangeSlider";
import RangeSlider from "../RangeSlider/RangeSlider";

interface Inputs {
  gender: string;
  minAge: string;
  maxAge: string;
  minDistance: string;
  maxDistance: string;
}

const SearchFilter = ({
  isOpen,
  handleClick,
}: {
  isOpen: boolean;
  handleClick: () => void;
}) => {
  const { register, handleSubmit } = useForm<Inputs>();
  const searchParamsReadOnly = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [locationRange, setLocationRange] = useState<number>(1);
  const [gender, setGender] = useState<"man" | "woman">("man");
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(100);

  function onSubmit(formData: Inputs) {
    const searchParams = new URLSearchParams(searchParamsReadOnly);

    for (const [name, value] of Object.entries(formData)) {
      searchParams.set(name, value);
    }

    router.replace(`${pathname}/?${searchParams.toString()}`);
  }

  function clearFilters() {
    setLocationRange(1);
    setGender("man");
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

      <form
        onSubmit={() => {
          handleSubmit(onSubmit);
        }}
        className={styles["search-filter__body"]}
      >
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
          <div className={styles["search-filter__input-group"]}>
            <label
              htmlFor="location"
              className={styles["search-filter__input-label"]}
            >
              <LocationOutlineSVG
                className={styles["search-filter__input-label-icon"]}
              />
              Location
            </label>
            <input
              type="text"
              name="location"
              id="location"
              className={styles["search-filter__input"]}
            />
          </div>

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
            {...register("gender")}
            className={styles["search-filter__button-group"]}
          >
            <button
              value="male"
              type="button"
              onClick={() => {
                setGender("man");
              }}
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              className={`${styles["search-filter__option-button"] ?? ""} ${(gender === "man" && styles["search-filter__option-button--selected"]) || ""}`}
            >
              Man
            </button>
            <button
              value="female"
              type="button"
              onClick={() => {
                setGender("woman");
              }}
              className={`${styles["search-filter__option-button"] ?? ""} ${(gender === "woman" && styles["search-filter__option-button--selected"]) || ""}`}
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

        <button className={styles["search-filter__submit-button"]}>
          Show coaches
        </button>
      </form>
    </div>
  );
};

export default SearchFilter;
