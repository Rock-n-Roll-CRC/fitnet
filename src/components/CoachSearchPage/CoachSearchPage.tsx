"use client";

import type { Session } from "next-auth";

import { useEffect } from "react";

import MapWrapper from "@/components/MapWrapper/MapWrapper";

import type { Tables } from "@/types/database";

const CoachSearchPage = ({
  session,
  userProfile,
}: {
  session: Session;
  userProfile: Tables<"profiles">;
}) => {
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
      <MapWrapper session={session} userProfile={userProfile} />
    </>
  );
};

export default CoachSearchPage;
