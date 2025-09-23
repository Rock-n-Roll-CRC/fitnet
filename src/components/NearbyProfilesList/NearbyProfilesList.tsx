"use client";

import type { Tables } from "@/types/database";

import Image from "next/image";

import ProfilePreview from "@/components/ProfilePreview/ProfilePreview";

import NotFoundSVG from "@/assets/illustrations/not-found.svg";

import styles from "./NearbyProfilesList.module.scss";

export default function NearbyProfilesList({
  userProfile,
  displayedProfiles,
  blockedCoaches,
}: {
  userProfile: Tables<"profiles">;
  displayedProfiles: (Tables<"profiles"> & { ratings: Tables<"reviews">[] })[];
  blockedCoaches: (Tables<"blocked_profiles"> & {
    blockerProfile: Tables<"profiles">;
    blockedProfile: Tables<"profiles">;
  })[];
}) {
  const filteredProfiles = displayedProfiles.filter(
    (profile) =>
      !blockedCoaches.map((el) => el.blocked_id).includes(profile.user_id),
  );

  return (
    <div className={styles["nearby-profiles-list"]}>
      {filteredProfiles.length > 0 ? (
        <>
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
                        className={styles["nearby-profiles-list__count-image"]}
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
