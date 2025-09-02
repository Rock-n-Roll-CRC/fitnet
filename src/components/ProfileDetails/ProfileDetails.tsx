"use client";

import type { Dispatch, SetStateAction } from "react";
import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ProfileAbout from "@/components/ProfileAbout/ProfileAbout";
import ProfileReviews from "@/components/ProfileReviews/ProfileReviews";

import styles from "./ProfileDetails.module.scss";

export default function ProfileDetails({
  session,
  profile,
  isEditing,
  editedProfile,
  setEditedProfile,
  tab,
  sort,
}: {
  session: Session;
  profile: Tables<"profiles"> & {
    ratings: (Tables<"reviews"> & {
      raterProfile: Tables<"profiles">;
    })[];
  };
  isEditing: boolean;
  editedProfile: Tables<"profiles">;
  setEditedProfile: Dispatch<SetStateAction<Tables<"profiles">>>;
  tab: string | string[];
  sort: string | string[];
}) {
  const readonlySearchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function handleSelectTab(tab: string) {
    const searchParams = new URLSearchParams(readonlySearchParams);

    searchParams.set("tab", tab);

    router.replace(`${pathname}/?${searchParams.toString()}`);
  }

  return (
    <div className={styles["profile-details"]}>
      {profile.role === "coach" ? (
        <>
          <div className={styles["profile-details__tabs"]}>
            <button
              onClick={() => {
                handleSelectTab("about");
              }}
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              className={`${styles["profile-details__tab"] ?? ""} ${(tab === "about" && styles["profile-details__tab--open"]) || ""}`}
            >
              About
            </button>
            <button
              onClick={() => {
                handleSelectTab("reviews");
              }}
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              className={`${styles["profile-details__tab"] ?? ""} ${(tab === "reviews" && styles["profile-details__tab--open"]) || ""}`}
            >
              Reviews
            </button>
          </div>

          {tab === "about" ? (
            <ProfileAbout
              profile={profile}
              isEditing={isEditing}
              editedProfile={editedProfile}
              setEditedProfile={setEditedProfile}
            />
          ) : (
            <ProfileReviews
              session={session}
              profile={profile}
              reviews={profile.ratings}
              sort={sort}
            />
          )}
        </>
      ) : (
        <ProfileAbout
          profile={profile}
          isEditing={isEditing}
          editedProfile={editedProfile}
          setEditedProfile={setEditedProfile}
        />
      )}
    </div>
  );
}
