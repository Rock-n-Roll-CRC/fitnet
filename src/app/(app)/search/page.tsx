import SearchFilter from "@/components/SearchFilter/SearchFilter";
import MapWrapper from "@/components/MapWrapper/MapWrapper";

import { getCoachProfiles } from "@/services/apiProfiles";

import styles from "./page.module.scss";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const coaches = await getCoachProfiles(await searchParams);

  return (
    <main className={styles.main}>
      <SearchFilter />

      <MapWrapper coaches={coaches} />
    </main>
  );
};

export default Page;
