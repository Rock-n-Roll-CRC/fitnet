"use client";

import type { Tables } from "@/types/database";
import type { Session } from "next-auth";

import { useState } from "react";

import ProfileOverview from "@/components/ProfileOverview/ProfileOverview";
import ProfileDetails from "@/components/ProfileDetails/ProfileDetails";

import styles from "./Profile.module.scss";

export default function Profile({
  session,
  profile,
  isProfileConnected,
  isProfileBlocked,
  isRequestSent,
  tab,
  sort,
}: {
  session: Session;
  profile: Tables<"profiles"> & {
    ratings: Tables<"reviews">[];
  };
  isProfileConnected: boolean;
  isProfileBlocked: boolean;
  isRequestSent: boolean;
  tab: "about" | "reviews";
  sort: "asc" | "desc";
}) {
  const { ratings, ...initialEditedProfile } = profile;

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] =
    useState<Tables<"profiles">>(initialEditedProfile);

  return (
    <div className={styles.profile}>
      <ProfileOverview
        session={session}
        profile={profile}
        editedProfile={editedProfile}
        isEditing={isEditing}
        isConnected={isProfileConnected}
        isRequestSent={isRequestSent}
        isBlocked={isProfileBlocked}
        setIsEditing={setIsEditing}
      />

      <ProfileDetails
        session={session}
        profile={profile}
        isEditing={isEditing}
        editedProfile={editedProfile}
        setEditedProfile={setEditedProfile}
        tab={tab}
        sort={sort}
      />
    </div>
  );
}
