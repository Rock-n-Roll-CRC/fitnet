import type { Tables } from "@/types/database";

import { useRef, useState, type Dispatch, type SetStateAction } from "react";

import { getCitySuggestions } from "@/services/apiLocation";

import LocationOutlineSVG from "@/assets/icons/location-outline.svg";

import styles from "./InputCity.module.scss";

interface SelectedCity {
  name: string;
  country: string;
}

export default function InputCity({
  editedProfile,
  setEditedProfile,
}: {
  editedProfile: Tables<"profiles">;
  setEditedProfile: Dispatch<SetStateAction<Tables<"profiles">>>;
}) {
  const [cityName, setCityName] = useState(editedProfile.city);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<SelectedCity[]>([]);

  const controller = useRef<AbortController | null>(null);

  return (
    <div className={styles["city-input"]}>
      <input
        type="text"
        name="city"
        id="city"
        autoComplete="off"
        value={cityName}
        onFocus={() => {
          setIsSuggestionsOpen(true);
        }}
        onBlur={() => {
          setIsSuggestionsOpen(false);
        }}
        onChange={(event) => {
          async function fetchData() {
            setCityName(event.target.value);

            const suggestions = await getCitySuggestions(
              event.target.value,
              controller,
            );
            setCitySuggestions(suggestions);
          }

          void fetchData();
        }}
        className={styles["city-input__input"]}
      />

      <ul
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        className={`${styles["city-input__suggestions"] ?? ""} ${(isSuggestionsOpen && styles["city-input__suggestions--open"]) || ""}`}
      >
        {citySuggestions.map((suggestion, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={(event) => {
                setCityName(suggestion.name);
                setEditedProfile({
                  ...editedProfile,
                  city: suggestion.name,
                });
                setIsSuggestionsOpen(false);
              }}
              className={styles["city-input__suggestion"]}
            >
              {`${suggestion.name}, ${suggestion.country}`}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
