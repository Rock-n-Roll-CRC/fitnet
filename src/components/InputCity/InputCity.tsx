import { useRef, useState } from "react";

import { getCitySuggestions } from "@/services/apiLocation";

import styles from "./InputCity.module.scss";

interface SelectedCity {
  name: string;
  country: string;
}

export default function InputCity({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
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
        value={value}
        onFocus={() => {
          setIsSuggestionsOpen(true);
        }}
        onBlur={() => {
          setIsSuggestionsOpen(false);
        }}
        onChange={(event) => {
          async function fetchData() {
            onChange(event.target.value);

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
              onClick={() => {
                onChange(suggestion.name);
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
