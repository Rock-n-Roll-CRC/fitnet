"use client";

import type { Tables } from "@/types/database";

import Image from "next/image";

import { deleteSavedProfile, deleteSaverProfile } from "@/services/actions";

const ProfileItem = ({ profile }: { profile: Tables<"profiles"> }) => {
  async function handleDeleteProfile(userId: string) {
    if (profile.role === "client") await deleteSaverProfile(userId);
    if (profile.role === "coach") await deleteSavedProfile(userId);
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

      <button onClick={() => void handleDeleteProfile(profile.user_id)}>
        Delete
      </button>
    </div>
  );
};

export default ProfileItem;
