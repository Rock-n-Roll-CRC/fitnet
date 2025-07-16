"use client";

import { sendConnectionRequest } from "@/services/actions";
import type { Tables } from "@/types/database";

export default function ConnectButton({
  profile,
}: {
  profile: Tables<"profiles">;
}) {
  async function handleConnectProfile() {
    await sendConnectionRequest(profile.user_id);
  }

  return <button onClick={handleConnectProfile}>Connect</button>;
}
