"use client";

import type { Tables } from "@/types/database";

import dynamic from "next/dynamic";

import styles from "./MapWrapper.module.scss";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { Session } from "next-auth";
import SearchFilter from "@/components/SearchFilter/SearchFilter";
import { getProfileByUserId } from "@/services/apiProfiles";

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
  session,
  userProfile,
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
  userProfile: Tables<"profiles">;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userCoords, setUserCoords] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 0, lng: 0 });

  function handleClick() {
    setIsOpen((isOpen) => !isOpen);
  }

  useEffect(() => {
    if (userProfile.location)
      setUserCoords(userProfile.location as unknown as Coordinates);
  }, [userProfile.location]);

  return (
    <div className={styles["map-wrapper"]}>
      <SearchFilter
        session={session}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userCoords={userCoords}
        setUserCoords={setUserCoords}
        handleClick={handleClick}
      />
      <Map
        coaches={coaches}
        blockedProfiles={blockedProfiles}
        isSelectingPosition={isSelectingPosition}
        userCoords={userCoords}
        setUserCoords={setUserCoords}
        session={session}
        isFilterOpen={isOpen}
      />
    </div>
  );
};

export default MapWrapper;
