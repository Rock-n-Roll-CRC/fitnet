"use client";

import type { Session } from "next-auth";

import { useState } from "react";

import CoachSearch from "@/components/CoachSearch/CoachSearch";
import MapWrapper from "@/components/MapWrapper/MapWrapper";

import { updateProfileLocation } from "@/services/actions";

interface Coordinates {
  lat: number;
  lng: number;
}

const CoachSearchPage = ({ session }: { session: Session }) => {
  const [isSelectingPosition, setIsSelectingPosition] = useState(false);
  const [userCoords, setUserCoords] = useState<Coordinates>();

  function handleSetLocation() {
    setIsSelectingPosition(true);
  }

  async function handleSaveLocation() {
    if (!userCoords) return;

    setIsSelectingPosition(false);
    await updateProfileLocation(session.user.id, userCoords);
  }

  return (
    <>
      {isSelectingPosition && (
        <div>
          <p>Set your location by clicking on the map</p>
        </div>
      )}

      <CoachSearch
        userCoords={userCoords}
        isSelectingPosition={isSelectingPosition}
        onSetLocation={handleSetLocation}
        onSaveLocation={handleSaveLocation}
      />

      <MapWrapper
        isSelectingPosition={isSelectingPosition}
        userCoords={userCoords}
        setUserCoords={setUserCoords}
        session={session}
      />
    </>
  );
};

export default CoachSearchPage;
