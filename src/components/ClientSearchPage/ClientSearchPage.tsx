import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import MapWrapper from "@/components/MapWrapper/MapWrapper";

const ClientSearchPage = async ({
  session,
  userProfile,
}: {
  session: Session;
  userProfile: Tables<"profiles">;
}) => {
  const coaches = await getCoachProfiles();
  const blockedProfiles = await getBlockedProfiles(session.user.id);

  return (
    <>
      <MapWrapper
        profiles={coaches}
        blockedProfiles={blockedProfiles}
        session={session}
        userProfile={userProfile}
      />
    </>
  );
};

export default ClientSearchPage;
