"use client";

import type { Session } from "next-auth";

import { useEffect, useState } from "react";

import MapWrapper from "@/components/MapWrapper/MapWrapper";

import { updateProfileLocation } from "@/services/actions";
import type { Tables } from "@/types/database";

const CoachSearchPage = ({
  session,
  isSearching,
  userProfile,
}: {
  session: Session;
  isSearching: boolean;
  userProfile: Tables<"profiles">;
}) => {
  const [isSelectingPosition, setIsSelectingPosition] = useState(false);

  function handleSetLocation() {
    setIsSelectingPosition(true);
  }

  async function handleSaveLocation() {
    if (!userCoords) return;

    setIsSelectingPosition(false);
    await updateProfileLocation(session.user.id, userCoords);
  }

  useEffect(() => {
    function handleBeforeUnload() {
      navigator.sendBeacon(
        "/api/set-is-searching",
        JSON.stringify({ value: false }),
      );
    }

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      handleBeforeUnload();
    };
  }, []);

  return (
    <>
      {isSelectingPosition && (
        <div>
          <p>Set your location by clicking on the map</p>
        </div>
      )}

      <MapWrapper
        isSelectingPosition={isSelectingPosition}
        session={session}
        userProfile={userProfile}
      />
    </>
  );
};

export default CoachSearchPage;
