"use client";

import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import { useOptimistic, useState } from "react";

import ProfilePreview from "@/components/ProfilePreview/ProfilePreview";
import EmptyState from "@/components/EmptyState/EmptyState";

import FeelingLonelySVG from "@/assets/illustrations/feeling-lonely.svg";

export default function SavedProfilesList({
  session,
  savedProfiles: initialSavedProfiles,
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
  const [savedProfiles] = useState(initialSavedProfiles);
  const [optimisticSavedProfiles, removeSavedProfile] = useOptimistic(
    savedProfiles,
    (state, userId: string) =>
      state.filter(
        (profile) =>
          profile.saverProfile.user_id !== userId ||
          profile.saved_user_id !== userId,
      ),
  );

  return optimisticSavedProfiles.length > 0 ? (
    optimisticSavedProfiles.map(({ saverProfile, savedProfile }) => (
      <ProfilePreview
        key={savedProfile.user_id}
        type="saved"
        profile={
          session.user.id === saverProfile.user_id ? savedProfile : saverProfile
        }
        onRemoveProfile={removeSavedProfile}
      />
    ))
  ) : (
    <EmptyState
      illustration={FeelingLonelySVG}
      heading={<>Looks like you have no friends!</>}
      description={<>As you add friends, they will appear here.</>}
    />
  );
}
