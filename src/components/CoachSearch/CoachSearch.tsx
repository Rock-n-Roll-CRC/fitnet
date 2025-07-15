"use client";

import { updateProfileIsSearching } from "@/services/actions";
import { useState } from "react";

interface Coordinates {
  lat: number;
  lng: number;
}

const CoachSearch = ({
  isSelectingPosition,
  onSetLocation,
  onSaveLocation,
  userCoords,
  isSearching: isSearchingProp,
}: {
  isSelectingPosition: boolean;
  onSetLocation: () => void;
  onSaveLocation: () => void;
  userCoords: Coordinates | undefined;
  isSearching: boolean;
}) => {
  const [isSearching, setIsSearching] = useState(isSearchingProp);
  const [isDisabled, setIsDisabled] = useState(false);

  async function handleToggleIsSearching() {
    setIsDisabled(true);
    await updateProfileIsSearching(!isSearching);
    setIsSearching((isSearching) => !isSearching);
    setTimeout(() => {
      setIsDisabled(false);
    }, 5000);
  }

  return (
    <div>
      <button
        onClick={handleToggleIsSearching}
        disabled={isDisabled}
      >{`${isSearching ? "Stop" : "Start"} Searching`}</button>

      <button
        onClick={
          isSelectingPosition && userCoords ? onSaveLocation : onSetLocation
        }
      >
        {isSelectingPosition && userCoords ? "Save location" : "Set location"}
      </button>
    </div>
  );
};

export default CoachSearch;
