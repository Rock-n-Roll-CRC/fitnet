import ProfilePreview from "@/components/ProfilePreview/ProfilePreview";
import EmptyState from "@/components/EmptyState/EmptyState";

import { auth } from "@/services/auth";
import { getBlockedProfiles } from "@/services/apiBlockedProfiles";

import FeelingLonelySVG from "@/assets/illustrations/feeling-lonely.svg";

export default async function Page() {
  const session = await auth();
  if (!session) return;

  const blockedProfiles = await getBlockedProfiles(session.user.id);

  return blockedProfiles.length > 0 ? (
    blockedProfiles.map(({ blockedProfile }) => (
      <ProfilePreview
        key={blockedProfile.user_id}
        profile={blockedProfile}
        type="blocked"
      />
    ))
  ) : (
    <EmptyState
      illustration={FeelingLonelySVG}
      heading={<>Looks like you have no blocked users!</>}
      description={<>As you block users, they will appear here.</>}
    />
  );
}
