import type { Dispatch, SetStateAction } from "react";
import type { Session } from "next-auth";
import type { Tables } from "@/types/database";
import type { UseFormHandleSubmit } from "react-hook-form";
import type { ProfileAboutFieldValues } from "@/shared/schemas/ProfileAboutSchema";

import Image from "next/image";

import Rating from "@/components/Rating/Rating";
import ProfileActions from "@/components/ProfileActions/ProfileActions";

import styles from "./ProfileOverview.module.scss";

export default function ProfileOverview({
  session,
  profile,
  setOptimisticProfile,
  editedProfile,
  setEditedProfile,
  isEditing,
  isConnected,
  isRequestSent,
  receivedRequest,
  isBlocked,
  setIsEditing,
  isOnline,
  setIsConnectedOptim,
  setIsRequestSentOptim,
  setIsBlockedOptim,
  handleSubmit,
}: {
  session: Session;
  profile: Tables<"profiles"> & {
    ratings: (Tables<"reviews"> & {
      raterProfile: Tables<"profiles">;
    })[];
  };
  setOptimisticProfile: (
    action: Tables<"profiles"> & {
      ratings: (Tables<"reviews"> & {
        raterProfile: Tables<"profiles">;
      })[];
    },
  ) => void;
  editedProfile: Tables<"profiles"> & {
    ratings: (Tables<"reviews"> & {
      raterProfile: Tables<"profiles">;
    })[];
  };
  setEditedProfile: Dispatch<
    SetStateAction<
      Tables<"profiles"> & {
        ratings: (Tables<"reviews"> & {
          raterProfile: Tables<"profiles">;
        })[];
      }
    >
  >;
  isEditing: boolean;
  isConnected: boolean;
  isRequestSent: boolean;
  receivedRequest:
    | (Tables<"connection_requests"> & {
        senderProfile: Tables<"profiles">;
        receiverProfile: Tables<"profiles">;
      })
    | null;
  isBlocked: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
  isOnline: boolean;
  setIsConnectedOptim: (
    action: boolean | ((pendingState: boolean) => boolean),
  ) => void;
  setIsRequestSentOptim: (
    action: boolean | ((pendingState: boolean) => boolean),
  ) => void;
  setIsBlockedOptim: (
    action: boolean | ((pendingState: boolean) => boolean),
  ) => void;
  handleSubmit: UseFormHandleSubmit<ProfileAboutFieldValues>;
}) {
  return (
    <article
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      className={`${styles["profile-overview"] ?? ""} ${(isOnline && session.user.id !== profile.user_id && styles["profile-overview--online"]) || ""}`}
    >
      <div className={styles["profile-overview__body"]}>
        <div className={styles["profile-overview__image-wrapper"]}>
          <Image
            src={profile.avatar_url}
            alt={profile.full_name}
            fill
            className={styles["profile-overview__image"]}
          />
        </div>

        <div className={styles["profile-overview__info-container"]}>
          <p className={styles["profile-overview__name"]}>
            {profile.full_name} ({profile.role})
          </p>

          {profile.role === "coach" && <Rating ratings={profile.ratings} />}

          <p className={styles["profile-overview__phone-number"]}>
            {profile.phone_number}
          </p>
        </div>
      </div>

      <ProfileActions
        session={session}
        profile={profile}
        setOptimisticProfile={setOptimisticProfile}
        editedProfile={editedProfile}
        setEditedProfile={setEditedProfile}
        isEditing={isEditing}
        isConnected={isConnected}
        isRequestSent={isRequestSent}
        receivedRequest={receivedRequest}
        isBlocked={isBlocked}
        setIsEditing={setIsEditing}
        setIsConnectedOptim={setIsConnectedOptim}
        setIsRequestSentOptim={setIsRequestSentOptim}
        setIsBlockedOptim={setIsBlockedOptim}
        handleSubmit={handleSubmit}
      />
    </article>
  );
}
