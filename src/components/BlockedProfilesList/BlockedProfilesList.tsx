"use client";

import type { Tables } from "@/types/database";

import { useOptimistic } from "react";

import ProfilePreview from "@/components/ProfilePreview/ProfilePreview";
import EmptyState from "@/components/EmptyState/EmptyState";

import OffRoadSVG from "@/assets/illustrations/off-road.svg";

export default function BlockedProfilesList({
  blockedProfiles,
}: {
  blockedProfiles: (Tables<"blocked_profiles"> & {
    blockerProfile: Tables<"profiles"> & {
      ratings: Tables<"reviews">[];
    };
    blockedProfile: Tables<"profiles"> & {
      ratings: Tables<"reviews">[];
    };
  })[];
}) {
  const [optimisticBlockedProfiles, removeProfile] = useOptimistic(
    blockedProfiles,
    (state, userId: string) =>
      state.filter(
        (profile) =>
          profile.blocked_id !== userId && profile.blocker_id !== userId,
      ),
  );

  return optimisticBlockedProfiles.length > 0 ? (
    optimisticBlockedProfiles.map(({ blockedProfile }) => (
      <ProfilePreview
        key={blockedProfile.user_id}
        profile={blockedProfile}
        type="blocked"
        onRemoveProfile={removeProfile}
      />
    ))
  ) : (
    <EmptyState
      illustration={OffRoadSVG}
      heading={<>Looks like you have no blocked users!</>}
      description={<>As you block users, they will appear here.</>}
    />
  );
}
