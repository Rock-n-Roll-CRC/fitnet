import ClientSearchPage from "@/components/ClientSearchPage/ClientSearchPage";
import CoachSearchPage from "@/components/CoachSearchPage/CoachSearchPage";

import { auth } from "@/services/auth";
import { getCoachProfiles, getProfileByUserId } from "@/services/apiProfiles";

import styles from "./page.module.scss";
import { getBlockedProfiles } from "@/services/apiBlockedProfiles";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const session = await auth();

  if (!session) return;

  const userProfile = await getProfileByUserId(session.user.id);

  if (!userProfile) return;

  const coaches = await getCoachProfiles(await searchParams);
  const blockedProfiles = await getBlockedProfiles(session.user.id);

  return (
    <main className={styles.main}>
      {userProfile.role === "client" ? (
        <ClientSearchPage
          coaches={coaches}
          blockedProfiles={blockedProfiles}
          session={session}
        />
      ) : (
        <CoachSearchPage
          session={session}
          isSearching={userProfile.isSearching}
        />
      )}
    </main>
  );
};

export default Page;

// Rating (stars) system
