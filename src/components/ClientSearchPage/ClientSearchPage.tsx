import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import MapWrapper from "@/components/MapWrapper/MapWrapper";

const ClientSearchPage = ({
  coaches,
  blockedProfiles,
  session,
  userProfile,
}: {
  coaches: (Tables<"profiles"> & { ratings: Tables<"reviews">[] })[];
  blockedProfiles: (Tables<"blocked_profiles"> & {
    blockerProfile: Tables<"profiles">;
    blockedProfile: Tables<"profiles">;
  })[];
  session: Session;
  userProfile: Tables<"profiles">;
}) => {
  return (
    <>
      <MapWrapper
        coaches={coaches}
        blockedProfiles={blockedProfiles}
        session={session}
        userProfile={userProfile}
      />
    </>
  );
};

export default ClientSearchPage;
