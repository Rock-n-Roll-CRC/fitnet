"use client";

import dynamic from "next/dynamic";

import styles from "./MapWrapper.module.scss";
import type { Session } from "next-auth";

const Map = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
});

const MapWrapper = ({
  session,
  coaches,
}: {
  session: Session;
  coaches: any[];
}) => {
  return (
    <div className={styles["map-wrapper"]}>
      <Map session={session} coaches={coaches} />
    </div>
  );
};

export default MapWrapper;
