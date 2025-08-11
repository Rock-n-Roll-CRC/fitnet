import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import SearchFilter from "@/components/SearchFilter/SearchFilter";
import MapWrapper from "@/components/MapWrapper/MapWrapper";

const ClientSearchPage = ({
  coaches,
  blockedProfiles,
  session,
}: {
  coaches: Tables<"profiles">[];
  blockedProfiles: (Tables<"blocked_profiles"> & {
    blockerProfile: Tables<"profiles">;
    blockedProfile: Tables<"profiles">;
  })[];
  session: Session;
}) => {
  return (
    <>
      <MapWrapper
        coaches={coaches}
        blockedProfiles={blockedProfiles}
        session={session}
      />
    </>
  );
};

export default ClientSearchPage;
