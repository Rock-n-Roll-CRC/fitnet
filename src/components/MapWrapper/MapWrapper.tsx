"use client";

import type { Tables } from "@/types/database";

import dynamic from "next/dynamic";

import styles from "./MapWrapper.module.scss";
import type { Dispatch, SetStateAction } from "react";
import type { Session } from "next-auth";

interface Coordinates {
  lat: number;
  lng: number;
}

const Map = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
});

const MapWrapper = ({
  coaches,
  isSelectingPosition,
  userCoords: userCoordsProp,
  setUserCoords: setUserCoordsProp,
  session,
}: {
  coaches?: Tables<"profiles">[];
  isSelectingPosition?: boolean;
  userCoords?: Coordinates;
  setUserCoords?: Dispatch<SetStateAction<Coordinates | undefined>>;
  session: Session;
}) => {
  return (
    <div className={styles["map-wrapper"]}>
      <Map
        coaches={coaches}
        isSelectingPosition={isSelectingPosition}
        userCoords={userCoordsProp}
        setUserCoords={setUserCoordsProp}
        session={session}
      />
    </div>
  );
};

export default MapWrapper;
