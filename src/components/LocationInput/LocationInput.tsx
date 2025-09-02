"use client";

import type { Dispatch, SetStateAction } from "react";
import type { Session } from "next-auth";

import { useEffect, useRef, useState } from "react";

import { getAddressByCoords, getSuggestions } from "@/services/apiLocation";
import { updateProfileLocation } from "@/services/actions";

import LocationOutlineSVG from "@/assets/icons/location-outline.svg";
import LocateOutlineSVG from "@/assets/icons/locate-outline.svg";

import styles from "./LocationInput.module.scss";

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
    [k: string]: unknown;
  };
}

interface SelectedLocation {
  name: string;
  lat: number;
  lon: number;
  properties: PhotonFeature["properties"];
}

export default function LocationInput({
  session,
  userCoords,
  setUserCoords,
}: {
  session: Session;
  userCoords: { lat: number; lng: number };
  setUserCoords: Dispatch<
    SetStateAction<{
      lat: number;
      lng: number;
    }>
  >;
}) {
  const [locationName, setLocationName] = useState("");
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<
    SelectedLocation[]
  >([]);

  const controller = useRef<AbortController | null>(null);

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
    <div className={styles["location-input"]}>
      <label htmlFor="location" className={styles["location-input__label"]}>
        <LocationOutlineSVG className={styles["location-input__label-icon"]} />
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
        className={styles["location-input__input"]}
      />
      <button
        type="button"
        onClick={locateUser}
        className={styles["location-input__locate-button"]}
      >
        <LocateOutlineSVG
          className={styles["location-input__locate-button-icon"]}
        />
      </button>
      <ul
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        className={`${styles["location-input__suggestions"] ?? ""} ${(isSuggestionsOpen && styles["location-input__suggestions--open"]) || ""}`}
      >
        {locationSuggestions.map((suggestion, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={() => {
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
              className={styles["location-input__suggestion"]}
            >
              {suggestion.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
