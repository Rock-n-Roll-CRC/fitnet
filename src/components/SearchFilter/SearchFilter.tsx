"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import styles from "./SearchFilter.module.scss";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import OptionsSVG from "@/assets/icons/options.svg";
import LocationOutlineSVG from "@/assets/icons/location-outline.svg";
import MultiRangeSlider from "../MultiRangeSlider/MultiRangeSlider";
import RangeSlider from "../RangeSlider/RangeSlider";
import { getAddressByCoords, getSuggestions } from "@/services/apiLocation";
import { updateProfileLocation } from "@/services/actions";
import type { Session } from "next-auth";
import LocateOutlineSVG from "@/assets/icons/locate-outline.svg";

interface Inputs {
  gender: string;
  minAge: string;
  maxAge: string;
  minDistance: string;
  maxDistance: string;
}

interface PhotonFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] }; // [lon, lat]
  properties: {
    name?: string;
    country?: string;
    city?: string;
    state?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    osm_type?: string;
    osm_id?: number;
    [k: string]: any;
  };
}

interface SelectedLocation {
  name: string;
  lat: number;
  lon: number;
  properties: PhotonFeature["properties"];
}

const SearchFilter = ({
  session,
  isOpen,
  setIsOpen,
  userCoords,
  setUserCoords,
  handleClick,
}: {
  session: Session;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  userCoords: { lat: number; lng: number };
  setUserCoords: Dispatch<
    SetStateAction<{
      lat: number;
      lng: number;
    }>
  >;
  handleClick: () => void;
}) => {
  const searchParamsReadOnly = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<
    SelectedLocation[]
  >([]);
  const [locationName, setLocationName] = useState("");
  const [locationRange, setLocationRange] = useState<number>(1);
  const [gender, setGender] = useState<"man" | "woman">("man");
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(100);

  const controller = useRef<AbortController | null>(null);

  function onSubmit(event: SubmitEvent) {
    event.preventDefault();

    setIsOpen(false);

    const searchParams = new URLSearchParams(searchParamsReadOnly);

    searchParams.set("distance", locationRange.toString());
    searchParams.set("gender", gender === "man" ? "male" : "female");
    searchParams.set("minAge", minAge.toString());
    searchParams.set("maxAge", maxAge.toString());

    router.replace(`${pathname}/?${searchParams.toString()}`);
  }

  function clearFilters() {
    setLocationRange(1);
    setGender("man");
    setMinAge(18);
    setMaxAge(100);
  }

  function locateUser() {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lng } }) => {
        setUserCoords({ lat, lng });
        void (async () => {
          await updateProfileLocation(session.user.id, { lat, lng });
        })();
      },
    );
  }

  useEffect(() => {
    async function fetchData() {
      const name = await getAddressByCoords(userCoords);
      setLocationName(name ?? "");
    }

    void fetchData();
  }, [userCoords]);

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles["search-filter"] ?? ""} ${(isOpen && styles["search-filter--open"]) || ""}`}
    >
      <button onClick={handleClick} className={styles["search-filter__button"]}>
        <OptionsSVG className={styles["search-filter__icon"]} />
      </button>

      <form onSubmit={onSubmit} className={styles["search-filter__body"]}>
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
              autoComplete="off"
              value={locationName}
              onFocus={() => {
                setIsSuggestionsOpen(true);
              }}
              onBlur={() => {
                setIsSuggestionsOpen(false);
              }}
              onChange={(event) => {
                async function fetchData() {
                  setLocationName(event.target.value);

                  const suggestions = await getSuggestions(
                    event.target.value,
                    controller,
                  );
                  setLocationSuggestions(suggestions);
                }

                void fetchData();
              }}
              className={styles["search-filter__input"]}
            />
            <button
              type="button"
              onClick={locateUser}
              className={styles["search-filter__locate-button"]}
            >
              <LocateOutlineSVG
                className={styles["search-filter__locate-icon"]}
              />
            </button>
            <ul
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              className={`${styles["search-filter__suggestions"] ?? ""} ${(isSuggestionsOpen && styles["search-filter__suggestions--open"]) || ""}`}
            >
              {locationSuggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={(event) => {
                      async function fetchData() {
                        setLocationName(suggestion.name);
                        setUserCoords({
                          lat: suggestion.lat,
                          lng: suggestion.lon,
                        });
                        setIsSuggestionsOpen(false);
                        await updateProfileLocation(session.user.id, {
                          lat: suggestion.lat,
                          lng: suggestion.lon,
                        });
                      }

                      void fetchData();
                    }}
                    className={styles["search-filter__suggestion"]}
                  >
                    {suggestion.name}
                  </button>
                </li>
              ))}
            </ul>
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
