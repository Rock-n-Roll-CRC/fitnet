import type { Session } from "next-auth";
import type { Tables } from "@/types/database";

import SearchFilter from "@/components/SearchFilter/SearchFilter";
import MapWrapper from "@/components/MapWrapper/MapWrapper";

const ClientSearchPage = ({
  coaches,
  session,
}: {
  coaches: Tables<"profiles">[];
  session: Session;
}) => {
  return (
    <>
      <SearchFilter />

      <MapWrapper coaches={coaches} session={session} />
    </>
  );
};

export default ClientSearchPage;
