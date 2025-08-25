"use client";

import type { Dispatch, SetStateAction } from "react";
import type { Session } from "next-auth";

import { useState } from "react";

import LocationInput from "@/components/LocationInput/LocationInput";

import { updateProfileIsSearching } from "@/services/actions";

import styles from "./CoachSearch.module.scss";

interface Coordinates {
  lat: number;
  lng: number;
}

const CoachSearch = ({
  session,
  userCoords,
  setUserCoords,
  isSearching: isSearchingProp,
}: {
  session: Session;
  userCoords: Coordinates;
  setUserCoords: Dispatch<
    SetStateAction<{
      lat: number;
      lng: number;
    }>
  >;
  isSearching: boolean;
}) => {
  return (
    <div className={styles["coach-search"]}>
      <div className={styles["coach-search__body"]}>
        <LocationInput
          session={session}
          userCoords={userCoords}
          setUserCoords={setUserCoords}
        />
      </div>

      <button
        onClick={() => {
          void updateProfileIsSearching(!isSearchingProp);
        }}
        className={styles["coach-search__button"]}
      >
        {isSearchingProp ? "Stop Search" : "Start Search"}
      </button>
    </div>
  );
};

export default CoachSearch;
