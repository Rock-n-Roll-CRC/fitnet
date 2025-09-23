"use client";

import type { Session } from "next-auth";
import type { Tables } from "@/types/database";
import type { Coordinates } from "@/shared/interfaces/Coordinates.interface";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import SearchFilter from "@/components/SearchFilter/SearchFilter";

import {
  revalidateSearch,
  updateProfileIsSearching,
  updateProfileLocation,
} from "@/services/actions";

import styles from "./MapWrapper.module.scss";
import toast from "react-hot-toast";

const SEARCH_REVALIDATE_INTERVAL = 5000;

const Map = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
});

const MapWrapper = ({
  session,
  userProfile,
  displayedProfiles,
  blockedProfiles,
  filters,
}: {
  session: Session;
  userProfile: Tables<"profiles">;
  displayedProfiles: (Tables<"profiles"> & { ratings: Tables<"reviews">[] })[];
  blockedProfiles?: (Tables<"blocked_profiles"> & {
    blockerProfile: Tables<"profiles">;
    blockedProfile: Tables<"profiles">;
  })[];
  filters: {
    distance: number;
    gender: "male" | "female";
    minAge: number;
    maxAge: number;
  };
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userCoords, setUserCoords] = useState(
    (userProfile.location as Coordinates | null) ?? {
      lat: 51.5074,
      lng: 0.1278,
    },
  );

  useEffect(() => {
    async function startSearching() {
      await updateProfileIsSearching(true);
    }

    function handleBeforeUnload() {
      navigator.sendBeacon(
        "/api/set-is-searching",
        JSON.stringify({ value: false }),
      );
    }

    void startSearching();

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      handleBeforeUnload();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (!userProfile.location) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          async function updateUserCoords() {
            const coords = {
              lat: location.coords.latitude,
              lng: location.coords.longitude,
            };

            setUserCoords(coords);
            await updateProfileLocation(session.user.id, coords);
          }

          void updateUserCoords();
        },
        () => {
          toast.error("Set your location in the filters!");
        },
      );
    }
  }, [session.user.id, userProfile.location]);

  useEffect(() => {
    const revalidateInterval = setInterval(() => {
      void revalidateSearch();
    }, SEARCH_REVALIDATE_INTERVAL);

    return () => {
      clearInterval(revalidateInterval);
    };
  }, []);

  return (
    <div className={styles["map-wrapper"]}>
      <SearchFilter
        session={session}
        userCoords={userCoords}
        setUserCoords={setUserCoords}
        filters={filters}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />

      <Map
        userProfile={userProfile}
        userCoords={userCoords}
        displayedProfiles={displayedProfiles}
        blockedProfiles={blockedProfiles}
        filters={filters}
        isFilterOpen={isOpen}
      />
    </div>
  );
};

export default MapWrapper;
