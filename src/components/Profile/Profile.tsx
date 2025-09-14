"use client";

import type { Tables } from "@/types/database";
import type { Session } from "next-auth";

import { useOptimistic, useState } from "react";

import ProfileOverview from "@/components/ProfileOverview/ProfileOverview";
import ProfileDetails from "@/components/ProfileDetails/ProfileDetails";

import { useOnlineUsers } from "@/hooks/useOnlineUsers";

import styles from "./Profile.module.scss";

export default function Profile({
  session,
  profile,
  myProfile,
  isProfileConnected,
  isProfileBlocked,
  isRequestSent,
  tab,
  sort,
}: {
  session: Session;
  profile: Tables<"profiles"> & {
    ratings: (Tables<"reviews"> & {
      raterProfile: Tables<"profiles">;
    })[];
  };
  myProfile: Tables<"profiles"> & {
    ratings: (Tables<"reviews"> & {
      raterProfile: Tables<"profiles">;
    })[];
  };
  isProfileConnected: boolean;
  isProfileBlocked: boolean;
  isRequestSent: boolean;
  tab: string | string[];
  sort: string | string[];
}) {
  const onlineUsers = useOnlineUsers();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [optimisticProfile, setOptimisticProfile] = useOptimistic(profile);

  const [isConnectedOptim, setIsConnectedOptim] =
    useOptimistic(isProfileConnected);
  const [isRequestSentOptim, setIsRequestSentOptim] =
    useOptimistic(isRequestSent);
  const [isBlockedOptim, setIsBlockedOptim] = useOptimistic(isProfileBlocked);

  return (
    <div className={styles.profile}>
      <ProfileOverview
        session={session}
        profile={optimisticProfile}
        setOptimisticProfile={setOptimisticProfile}
        editedProfile={editedProfile}
        setIsEditing={setIsEditing}
        isOnline={onlineUsers.includes(profile.user_id)}
        isEditing={isEditing}
        isConnected={isConnectedOptim}
        isRequestSent={isRequestSentOptim}
        isBlocked={isBlockedOptim}
        setIsConnectedOptim={setIsConnectedOptim}
        setIsRequestSentOptim={setIsRequestSentOptim}
        setIsBlockedOptim={setIsBlockedOptim}
      />

      <ProfileDetails
        session={session}
        profile={optimisticProfile}
        myProfile={myProfile}
        setOptimisticProfile={setOptimisticProfile}
        isEditing={isEditing}
        editedProfile={editedProfile}
        setEditedProfile={setEditedProfile}
        tab={tab}
        sort={sort}
      />
    </div>
  );
}
