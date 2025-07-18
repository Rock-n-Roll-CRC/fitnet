"use client";

import type { Tables } from "@/types/database";

import { sendConnectionRequest } from "@/services/actions";

export default function ConnectButton({
  profile,
  onClose,
}: {
  profile: Tables<"profiles">;
  onClose?: () => void;
}) {
  async function handleConnectProfile() {
    await sendConnectionRequest(profile.user_id);

    onClose?.();
  }

  return <button onClick={handleConnectProfile}>Connect</button>;
}
