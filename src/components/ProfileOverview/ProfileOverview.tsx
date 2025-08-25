import type { Dispatch, SetStateAction } from "react";
import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import Image from "next/image";

import Rating from "@/components/Rating/Rating";
import ProfileActions from "@/components/ProfileActions/ProfileActions";

import styles from "./ProfileOverview.module.scss";

export default function ProfileOverview({
  session,
  profile,
  editedProfile,
  isEditing,
  isConnected,
  isRequestSent,
  isBlocked,
  setIsEditing,
}: {
  session: Session;
  profile: Tables<"profiles"> & { ratings: Tables<"ratings">[] };
  editedProfile: Tables<"profiles">;
  isEditing: boolean;
  isConnected: boolean;
  isRequestSent: boolean;
  isBlocked: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <article className={styles["profile-overview"]}>
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
        editedProfile={editedProfile}
        isEditing={isEditing}
        isConnected={isConnected}
        isRequestSent={isRequestSent}
        isBlocked={isBlocked}
        setIsEditing={setIsEditing}
      />
    </article>
  );
}
