import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import MapWrapper from "@/components/MapWrapper/MapWrapper";

const CoachSearchPage = async ({
  session,
  userProfile,
}: {
  session: Session;
  userProfile: Tables<"profiles">;
}) => {
  const clients = await getClientProfiles();
  const blockedProfiles = await getBlockedProfiles(session.user.id);

  return (
    <>
      <MapWrapper
        profiles={clients}
        blockedProfiles={blockedProfiles}
        session={session}
        userProfile={userProfile}
      />
    </>
  );
};

export default CoachSearchPage;
