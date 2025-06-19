import MapWrapper from "@/components/MapWrapper/MapWrapper";

import styles from "./page.module.scss";
import { getCoachesProfiles } from "@/services/apiProfiles";
import { auth } from "@/services/auth";
import SearchFilter from "@/components/SearchFilter/SearchFilter";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const searchParameters = await searchParams;
  const session = await auth();
  const coaches = await getCoachesProfiles(searchParameters);

  if (!session) return;

  return (
    <main className={styles.main}>
      <SearchFilter />

      <MapWrapper session={session} coaches={coaches} />
    </main>
  );
};

export default Page;
