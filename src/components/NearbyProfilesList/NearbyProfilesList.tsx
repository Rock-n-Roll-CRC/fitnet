"use client";

import type { Tables } from "@/types/database";
import type { TouchEvent } from "react";

import { useRef, useState } from "react";
import Image from "next/image";

import DragHandle from "@/components/DragHandle/DragHandle";
import ProfilePreview from "@/components/ProfilePreview/ProfilePreview";

import NotFoundSVG from "@/assets/illustrations/not-found.svg";

import styles from "./NearbyProfilesList.module.scss";

export default function NearbyProfilesList({
  userProfile,
  displayedProfiles,
  blockedCoaches,
  selectedProfile,
  isGrayed,
}: {
  userProfile: Tables<"profiles">;
  displayedProfiles: (Tables<"profiles"> & { ratings: Tables<"reviews">[] })[];
  blockedCoaches: (Tables<"blocked_profiles"> & {
    blockerProfile: Tables<"profiles">;
    blockedProfile: Tables<"profiles">;
  })[];
  selectedProfile?: Tables<"profiles">;
  isGrayed: boolean;
}) {
  const [startY, setStartY] = useState(0);
  const [translateY, setTranslateY] = useState(18);
  const [isPulling, setIsPulling] = useState(false);
  const lastTime = useRef(0);
  const lastY = useRef(18);
  const velocity = useRef(0);
  const maxTranslate = 28 - 10;
  const threshold = 0.1;

  function handleTouchStart(e: TouchEvent<HTMLDivElement>) {
    const currentY = e.touches[0]?.clientY;

    if (!currentY) return;

    setStartY(currentY);
    setIsPulling(true);
    lastY.current = currentY;
    lastTime.current = Date.now();
  }

  function handleTouchMove(e: TouchEvent<HTMLDivElement>) {
    if (isPulling) {
      const currentY = e.touches[0]?.clientY;

      if (!currentY) return;

      const deltaY = startY - currentY;
      setTranslateY(Math.max(0, Math.min(maxTranslate, maxTranslate - deltaY)));

      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime.current;

      if (deltaTime > 0) {
        velocity.current = (currentY - lastY.current) / deltaTime;
      }

      lastY.current = currentY;
      lastTime.current = currentTime;
    }
  }

  function handleTouchEnd() {
    setIsPulling(false);
    const absVelocity = Math.abs(velocity.current);
    if (absVelocity > threshold) {
      // Snap based on velocity direction
      setTranslateY(velocity.current < 0 ? 0 : maxTranslate);
    } else {
      // Low velocity: snap to closest state
      setTranslateY(translateY < maxTranslate / 2 ? 0 : maxTranslate);
    }
  }

  const filteredProfiles = displayedProfiles
    .filter(
      (profile) =>
        !blockedCoaches.map((el) => el.blocked_id).includes(profile.user_id),
    )
    .sort((a, b) => {
      if (a.user_id === selectedProfile?.user_id) return -1;
      if (b.user_id === selectedProfile?.user_id) return 1;
      return 0;
    });

  return (
    <div
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles["nearby-profiles-list"] ?? ""} ${(isGrayed && styles["nearby-profiles-list--grayed"]) || ""}`}
      style={{
        transform: `translateY(${translateY.toString()}rem)`,
        overflow: translateY === 0 ? "auto" : "hidden",
      }}
    >
      {filteredProfiles.length > 0 ? (
        <>
          <DragHandle
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />

          <div className={styles["nearby-profiles-list__body"]}>
            <div className={styles["nearby-profiles-list__count-box"]}>
              <p className={styles["nearby-profiles-list__count-label"]}>
                {userProfile.role === "client" ? "Coaches" : "Clients"} in the
                area
              </p>

              <div className={styles["nearby-profiles-list__count-body"]}>
                <ul className={styles["nearby-profiles-list__count-list"]}>
                  {filteredProfiles.length > 4
                    ? filteredProfiles
                        .slice(0, 4)
                        .map((profile) => (
                          <Image
                            key={profile.user_id}
                            src={profile.avatar_url}
                            alt={profile.full_name}
                            height={250}
                            width={250}
                            className={
                              styles["nearby-profiles-list__count-image"]
                            }
                          />
                        ))
                    : filteredProfiles.map((profile) => (
                        <Image
                          key={profile.user_id}
                          src={profile.avatar_url}
                          alt={profile.full_name}
                          height={250}
                          width={250}
                          className={
                            styles["nearby-profiles-list__count-image"]
                          }
                        />
                      ))}
                </ul>
                {filteredProfiles.length > 4 && (
                  <p>+{filteredProfiles.length - 4}</p>
                )}
              </div>
            </div>

            <ul className={styles["nearby-profiles-list__list"]}>
              {filteredProfiles.map((profile) => (
                <ProfilePreview key={profile.user_id} profile={profile} />
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className={styles["nearby-profiles-list__empty-state"]}>
          <p className={styles["nearby-profiles-list__empty-message"]}>
            There are no {userProfile.role === "client" ? "coaches" : "clients"}{" "}
            nearby. Try to adjust the filters!
          </p>

          <NotFoundSVG
            className={styles["nearby-profiles-list__empty-illustration"]}
          />
        </div>
      )}
    </div>
  );
}
