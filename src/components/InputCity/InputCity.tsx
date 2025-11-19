import { useRef, useState } from "react";

import { getCitySuggestions } from "@/services/apiLocation";

import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

import styles from "./InputCity.module.scss";

interface SelectedCity {
  name: string;
  country: string;
}

export default function InputCity({
  label,
  register,
  error,
  value,
  onChange,
  fill,
}: {
  label?: boolean;
  register?: UseFormRegisterReturn;
  error?: FieldError;
  value: string;
  onChange: (val: string) => void;
  fill?: boolean;
}) {
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<SelectedCity[]>([]);

  const controller = useRef<AbortController | null>(null);

  return (
    <div
      onClick={(event) => {
        console.log(`Clicked some shi: ${event.currentTarget.className}`);
      }}
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles["city-input"] ?? ""} ${(label && styles["city-input--labeled"]) || ""} ${(error && styles["city-input--error"]) || ""} ${(fill && styles["city-input--filled"]) || ""}`}
    >
      <div className={styles["city-input__container"]}>
        {label && (
          <label htmlFor="city" className={styles["city-input__label"]}>
            City
          </label>
        )}

        <input
          type="text"
          id="city"
          autoComplete="off"
          value={value}
          onFocus={() => {
            setIsSuggestionsOpen(true);
          }}
          {...register}
          onBlur={(event) => {
            setTimeout(() => {
              setIsSuggestionsOpen(false);
              void register?.onBlur(event);
            }, 150);
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
            void register?.onChange(event);
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
                  register?.onChange({
                    target: { value: suggestion.name, name: register.name },
                  });
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

      {error && (
        <p className={styles["city-input__error-message"]}>{error.message}</p>
      )}
    </div>
  );
}
