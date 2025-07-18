"use client";

import type { Tables } from "@/types/database";

import { blockProfile, unblockProfile } from "@/services/actions";
import { useState } from "react";

export default function BlockButton({
  profile,
  initialIsBlocked,
  onClose,
}: {
  profile: Tables<"profiles">;
  initialIsBlocked: boolean;
  onClose?: () => void;
}) {
  const [isBlocked, setIsBlocked] = useState(initialIsBlocked);

  async function handleUnblockProfile() {
    await unblockProfile(profile.user_id);
    setIsBlocked(false);

    onClose?.();
  }

  async function handleBlockProfile() {
    await blockProfile(profile.user_id);
    setIsBlocked(true);

    onClose?.();
  }

  return (
    <button onClick={isBlocked ? handleUnblockProfile : handleBlockProfile}>
      {isBlocked ? "Unblock Profile" : "Block Profile"}
    </button>
  );
}
