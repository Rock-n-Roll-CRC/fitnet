import { auth } from "@/services/auth";
import { getBlockedProfiles } from "@/services/apiBlockedProfiles";

import BlockedProfilesList from "@/components/BlockedProfilesList/BlockedProfilesList";

export default async function Page() {
  const session = await auth();
  if (!session) return;

  const blockedProfiles = await getBlockedProfiles(session.user.id);

  return <BlockedProfilesList blockedProfiles={blockedProfiles} />;
}
