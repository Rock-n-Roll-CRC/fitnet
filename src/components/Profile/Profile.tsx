"use client";

import type { Tables } from "@/types/database";
import type { Session } from "next-auth";
import type { ProfileAboutFieldValues } from "@/shared/schemas/ProfileAboutSchema";

import { useOptimistic, useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

import ProfileOverview from "@/components/ProfileOverview/ProfileOverview";
import ProfileDetails from "@/components/ProfileDetails/ProfileDetails";

import { useOnlineUsers } from "@/hooks/useOnlineUsers";

import { ProfileAboutSchema } from "@/shared/schemas/ProfileAboutSchema";

import styles from "./Profile.module.scss";

export default function Profile({
  session,
  profile,
  myProfile,
  isProfileConnected,
  isProfileBlocked,
  sentRequest,
  receivedRequest,
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
  sentRequest:
    | (Tables<"connection_requests"> & {
        senderProfile: Tables<"profiles">;
        receiverProfile: Tables<"profiles">;
      })
    | null;
  receivedRequest:
    | (Tables<"connection_requests"> & {
        senderProfile: Tables<"profiles">;
        receiverProfile: Tables<"profiles">;
      })
    | null;
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
    useOptimistic(!!sentRequest);
  const [isBlockedOptim, setIsBlockedOptim] = useOptimistic(isProfileBlocked);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileAboutFieldValues>({
    resolver: standardSchemaResolver(ProfileAboutSchema),
  });

  return (
    <div className={styles.profile}>
      <ProfileOverview
        session={session}
        profile={optimisticProfile}
        setOptimisticProfile={setOptimisticProfile}
        editedProfile={editedProfile}
        setEditedProfile={setEditedProfile}
        setIsEditing={setIsEditing}
        isOnline={onlineUsers.includes(profile.user_id)}
        isEditing={isEditing}
        isConnected={isConnectedOptim}
        isRequestSent={isRequestSentOptim}
        receivedRequest={receivedRequest}
        isBlocked={isBlockedOptim}
        setIsConnectedOptim={setIsConnectedOptim}
        setIsRequestSentOptim={setIsRequestSentOptim}
        setIsBlockedOptim={setIsBlockedOptim}
        handleSubmit={handleSubmit}
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
        register={register}
        formErrors={errors}
      />
    </div>
  );
}
