"use client";

import { useState, type Dispatch, type SetStateAction } from "react";
import type { Session } from "next-auth";
import type { Tables } from "@/types/database";
import type { FieldErrors, UseFormRegister } from "react-hook-form";
import type { ProfileAboutFieldValues } from "@/shared/schemas/ProfileAboutSchema";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import ProfileAbout from "@/components/ProfileAbout/ProfileAbout";
import ProfileReviews from "@/components/ProfileReviews/ProfileReviews";

import styles from "./ProfileDetails.module.scss";

export default function ProfileDetails({
  session,
  profile,
  myProfile,
  setOptimisticProfile,
  isEditing,
  editedProfile,
  setEditedProfile,
  tab,
  sort,
  register,
  formErrors,
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
  setOptimisticProfile: (
    action: Tables<"profiles"> & {
      ratings: (Tables<"reviews"> & {
        raterProfile: Tables<"profiles">;
      })[];
    },
  ) => void;
  isEditing: boolean;
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
  tab: string | string[];
  sort: string | string[];
  register: UseFormRegister<ProfileAboutFieldValues>;
  formErrors: FieldErrors<ProfileAboutFieldValues>;
}) {
  const readonlySearchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [currentTab, setCurrentTab] = useState(tab);

  function handleSelectTab(tab: "about" | "reviews") {
    setCurrentTab(tab);

    const searchParams = new URLSearchParams(readonlySearchParams);
    searchParams.set("tab", tab);
    router.replace(`${pathname}?${searchParams.toString()}`, { scroll: false });
  }

  return (
    <div className={styles["profile-details"]}>
      <>
        {profile.role === "coach" ? (
          <>
            <div className={styles["profile-details__tabs"]}>
              <button
                onClick={() => {
                  handleSelectTab("about");
                }}
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                className={`${styles["profile-details__tab"] ?? ""} ${(currentTab === "about" && styles["profile-details__tab--open"]) || ""}`}
              >
                About
              </button>
              <button
                onClick={() => {
                  handleSelectTab("reviews");
                }}
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
                className={`${styles["profile-details__tab"] ?? ""} ${(currentTab === "reviews" && styles["profile-details__tab--open"]) || ""}`}
              >
                Reviews
              </button>
            </div>

            <ProfileAbout
              profile={profile}
              isEditing={isEditing}
              editedProfile={editedProfile}
              setEditedProfile={setEditedProfile}
              register={register}
              formErrors={formErrors}
              currentTab={currentTab}
            />

            <ProfileReviews
              session={session}
              profile={profile}
              myProfile={myProfile}
              setOptimisticProfile={setOptimisticProfile}
              sort={sort}
              currentTab={currentTab}
            />
          </>
        ) : (
          <ProfileAbout
            profile={profile}
            isEditing={isEditing}
            editedProfile={editedProfile}
            setEditedProfile={setEditedProfile}
            register={register}
            formErrors={formErrors}
            currentTab={currentTab}
          />
        )}
      </>
    </div>
  );
}
