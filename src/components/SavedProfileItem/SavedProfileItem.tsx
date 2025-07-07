"use client";

import type { Tables } from "@/types/database";

import Image from "next/image";

import { deleteSavedProfile } from "@/services/actions";

const SavedProfileItem = ({
  savedProfile,
}: {
  savedProfile: Tables<"profiles">;
}) => {
  async function handleDeleteSavedProfile(savedProfileId: string) {
    await deleteSavedProfile(savedProfileId);
  }

  return (
    <div>
      <Image
        src={savedProfile.avatar_url}
        alt={savedProfile.full_name}
        width={30}
        height={30}
      />
      <p>Full Name: {savedProfile.full_name}</p>
      <p>Age: {savedProfile.age}</p>
      <p>Gender: {savedProfile.gender}</p>
      <p>Phone Number: {savedProfile.phone_number}</p>

      <button
        onClick={() => void handleDeleteSavedProfile(savedProfile.user_id)}
      >
        Delete
      </button>
    </div>
  );
};

export default SavedProfileItem;
