"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import styles from "./SearchFilter.module.scss";

interface Inputs {
  gender: string;
  minAge: string;
  maxAge: string;
  minDistance: string;
  maxDistance: string;
}

const SearchFilter = () => {
  const { register, handleSubmit } = useForm<Inputs>();
  const searchParamsReadOnly = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function onSubmit(formData: Inputs) {
    const searchParams = new URLSearchParams(searchParamsReadOnly);

    for (const [name, value] of Object.entries(formData)) {
      searchParams.set(name, value);
    }

    router.replace(`${pathname}/?${searchParams.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles["search-filter"]}>
      <div className={styles["search-filter__input-wrapper"]}>
        <label
          htmlFor="gender"
          className={styles["search-filter__input-label"]}
        >
          Gender:
        </label>
        <select
          id="gender"
          defaultValue={searchParamsReadOnly.get("gender") ?? "male"}
          {...register("gender")}
          className={styles["search-filter__select"]}
        >
          <option
            value="male"
            className={styles["search-filter__select-option"]}
          >
            Male
          </option>
          <option
            value="female"
            className={styles["search-filter__select-option"]}
          >
            Female
          </option>
        </select>
      </div>

      <div className={styles["search-filter__input-group-wrapper"]}>
        <span className={styles["search-filter__input-group-heading"]}>
          Age:
        </span>

        <div className={styles["search-filter__input-group"]}>
          <div className={styles["search-filter__input-wrapper"]}>
            <label
              htmlFor="minAge"
              className={styles["search-filter__input-label"]}
            >
              From:
            </label>
            <input
              type="number"
              id="minAge"
              defaultValue={searchParamsReadOnly.get("minAge") ?? ""}
              {...register("minAge")}
              className={styles["search-filter__input"]}
            />
          </div>

          <div className={styles["search-filter__input-wrapper"]}>
            <label
              htmlFor="maxAge"
              className={styles["search-filter__input-label"]}
            >
              To:
            </label>
            <input
              type="number"
              id="maxAge"
              defaultValue={searchParamsReadOnly.get("maxAge") ?? ""}
              {...register("maxAge")}
              className={styles["search-filter__input"]}
            />
          </div>
        </div>
      </div>

      <div className={styles["search-filter__input-group-wrapper"]}>
        <span className={styles["search-filter__input-group-heading"]}>
          Distance:
        </span>

        <div className={styles["search-filter__input-group"]}>
          <div className={styles["search-filter__input-wrapper"]}>
            <label
              htmlFor="minDistance"
              className={styles["search-filter__input-label"]}
            >
              From:
            </label>
            <input
              type="number"
              id="minDistance"
              defaultValue={searchParamsReadOnly.get("minDistance") ?? ""}
              {...register("minDistance")}
              className={styles["search-filter__input"]}
            />
          </div>

          <div className={styles["search-filter__input-wrapper"]}>
            <label
              htmlFor="maxDistance"
              className={styles["search-filter__input-label"]}
            >
              To:
            </label>
            <input
              type="number"
              id="maxDistance"
              defaultValue={searchParamsReadOnly.get("maxDistance") ?? ""}
              {...register("maxDistance")}
              className={styles["search-filter__input"]}
            />
          </div>
        </div>
      </div>

      <button>Start Searching</button>
    </form>
  );
};

export default SearchFilter;
