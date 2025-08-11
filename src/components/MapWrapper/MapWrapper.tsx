"use client";

import type { Tables } from "@/types/database";

import dynamic from "next/dynamic";

import styles from "./MapWrapper.module.scss";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { Session } from "next-auth";
import SearchFilter from "@/components/SearchFilter/SearchFilter";

interface Coordinates {
  lat: number;
  lng: number;
}

const Map = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
});

const MapWrapper = ({
  coaches,
  blockedProfiles,
  isSelectingPosition,
  userCoords: userCoordsProp,
  setUserCoords: setUserCoordsProp,
  session,
}: {
  coaches?: Tables<"profiles">[];
  blockedProfiles?: (Tables<"blocked_profiles"> & {
    blockerProfile: Tables<"profiles">;
    blockedProfile: Tables<"profiles">;
  })[];
  isSelectingPosition?: boolean;
  userCoords?: Coordinates;
  setUserCoords?: Dispatch<SetStateAction<Coordinates | undefined>>;
  session: Session;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  function handleClick() {
    setIsOpen((isOpen) => !isOpen);
  }

  return (
    <div className={styles["map-wrapper"]}>
      <SearchFilter isOpen={isOpen} handleClick={handleClick} />
      <Map
        coaches={coaches}
        blockedProfiles={blockedProfiles}
        isSelectingPosition={isSelectingPosition}
        userCoords={userCoordsProp}
        setUserCoords={setUserCoordsProp}
        session={session}
        isFilterOpen={isOpen}
      />
    </div>
  );
};

export default MapWrapper;
