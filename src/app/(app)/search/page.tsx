import ClientSearchPage from "@/components/ClientSearchPage/ClientSearchPage";
import CoachSearchPage from "@/components/CoachSearchPage/CoachSearchPage";

import { auth } from "@/services/auth";
import {
  getNotBlockedCoachProfiles,
  getProfileByUserId,
} from "@/services/apiProfiles";

import styles from "./page.module.scss";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const session = await auth();

  if (!session) return;

  const userProfile = await getProfileByUserId(session.user.id);

  if (!userProfile) return;

  const coaches = await getNotBlockedCoachProfiles(
    session.user.id,
    await searchParams,
  );

  return (
    <main className={styles.main}>
      {userProfile.role === "client" ? (
        <ClientSearchPage coaches={coaches} session={session} />
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

// Display blocked on the map as red (open profile + unblock button) + Page with blocking/unblocking
// Request history page
// Rating (stars) system
