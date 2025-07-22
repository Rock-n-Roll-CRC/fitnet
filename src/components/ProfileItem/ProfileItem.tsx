"use client";

import type { Tables } from "@/types/database";

import Image from "next/image";

import { deleteSavedProfile, unblockProfile } from "@/services/actions";

const ProfileItem = ({
  profile,
  type = "saved",
}: {
  profile: Tables<"profiles">;
  type?: "saved" | "blocked";
}) => {
  async function handleDeleteProfile(userId: string) {
    await deleteSavedProfile(userId);
  }

  async function handleUnblockProfile(userId: string) {
    await unblockProfile(userId);
  }

  return (
    <div>
      <Image
        src={profile.avatar_url}
        alt={profile.full_name}
        width={30}
        height={30}
      />
      <p>Full Name: {profile.full_name}</p>
      <p>Age: {profile.age}</p>
      <p>Gender: {profile.gender}</p>
      <p>Phone Number: {profile.phone_number}</p>

      {type === "saved" && (
        <button onClick={() => void handleDeleteProfile(profile.user_id)}>
          Delete
        </button>
      )}
      {type === "blocked" && (
        <button onClick={() => void handleUnblockProfile(profile.user_id)}>
          Unblock
        </button>
      )}
    </div>
  );
};

export default ProfileItem;
