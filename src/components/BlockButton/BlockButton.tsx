"use client";

import type { Tables } from "@/types/database";

import { blockProfile, unblockProfile } from "@/services/actions";
import { useState } from "react";

export default function BlockButton({
  isBlocked: isBlockedProp,
  profile,
}: {
  isBlocked: boolean;
  profile: Tables<"profiles">;
}) {
  const [isBlocked, setIsBlocked] = useState(isBlockedProp);

  async function handleUnblockProfile() {
    await unblockProfile(profile.user_id);
    setIsBlocked(false);
  }

  async function handleBlockProfile() {
    await blockProfile(profile.user_id);
    setIsBlocked(true);
  }

  return (
    <button onClick={isBlocked ? handleUnblockProfile : handleBlockProfile}>
      {isBlocked ? "Unblock Profile" : "Block Profile"}
    </button>
  );
}
