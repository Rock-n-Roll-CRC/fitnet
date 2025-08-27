"use client";

import type { Tables } from "@/types/database";

import dynamic from "next/dynamic";

import styles from "./MapWrapper.module.scss";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { Session } from "next-auth";
import SearchFilter from "@/components/SearchFilter/SearchFilter";
import { getProfileByUserId } from "@/services/apiProfiles";
import CoachSearch from "@/components/CoachSearch/CoachSearch";

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
  coaches?: (Tables<"profiles"> & { ratings: Tables<"reviews">[] })[];
  blockedProfiles?: (Tables<"blocked_profiles"> & {
    blockerProfile: Tables<"profiles">;
    blockedProfile: Tables<"profiles">;
  })[];
  isSelectingPosition?: boolean;
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
      {userProfile.role === "client" ? (
        <SearchFilter
          session={session}
          userCoords={userCoords}
          isOpen={isOpen}
          setUserCoords={setUserCoords}
          setIsOpen={setIsOpen}
          handleClick={handleClick}
        />
      ) : (
        <CoachSearch
          session={session}
          userCoords={userCoords}
          setUserCoords={setUserCoords}
          isSearching={userProfile.isSearching}
        />
      )}
      <Map
        coaches={coaches}
        blockedProfiles={blockedProfiles}
        isSelectingPosition={isSelectingPosition}
        userCoords={userCoords}
        setUserCoords={setUserCoords}
        session={session}
        isFilterOpen={isOpen}
        userProfile={userProfile}
      />
    </div>
  );
};

export default MapWrapper;
