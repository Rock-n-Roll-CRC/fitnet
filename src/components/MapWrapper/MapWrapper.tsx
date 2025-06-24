"use client";

import type { Tables } from "@/types/database";

import dynamic from "next/dynamic";

import styles from "./MapWrapper.module.scss";

const Map = dynamic(() => import("@/components/Map/Map"), {
  ssr: false,
});

const MapWrapper = ({ coaches }: { coaches: Tables<"profiles">[] }) => {
  return (
    <div className={styles["map-wrapper"]}>
      <Map coaches={coaches} />
    </div>
  );
};

export default MapWrapper;
