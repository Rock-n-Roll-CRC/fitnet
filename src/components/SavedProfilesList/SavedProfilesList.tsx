"use client";

import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import { useOptimistic } from "react";

import ProfilePreview from "@/components/ProfilePreview/ProfilePreview";
import EmptyState from "@/components/EmptyState/EmptyState";

import OnlineCommunitySVG from "@/assets/illustrations/online-community.svg";

import styles from "./SavedProfilesList.module.scss";

export default function SavedProfilesList({
  session,
  savedProfiles,
}: {
  session: Session;
  savedProfiles: (Tables<"saved_profiles"> & {
    saverProfile: Tables<"profiles"> & {
      ratings: Tables<"reviews">[];
    };
    savedProfile: Tables<"profiles"> & {
      ratings: Tables<"reviews">[];
    };
  })[];
}) {
  const [optimisticSavedProfiles, removeSavedProfile] = useOptimistic(
    savedProfiles,
    (state, userId: string) =>
      state.filter(
        (profile) =>
          profile.saverProfile.user_id !== userId &&
          profile.saved_user_id !== userId,
      ),
  );

  return optimisticSavedProfiles.length > 0 ? (
    <ul className={styles["saved-profiles-list"]}>
      {optimisticSavedProfiles.map(({ saverProfile, savedProfile }) => (
        <ProfilePreview
          key={savedProfile.user_id}
          type="saved"
          profile={
            session.user.id === saverProfile.user_id
              ? savedProfile
              : saverProfile
          }
          onRemoveProfile={removeSavedProfile}
        />
      ))}
    </ul>
  ) : (
    <EmptyState
      illustration={OnlineCommunitySVG}
      heading={<>Looks like you have no friends!</>}
      description={<>As you add friends, they will appear here.</>}
      ctaText={<>Search for friends</>}
    />
  );
}
