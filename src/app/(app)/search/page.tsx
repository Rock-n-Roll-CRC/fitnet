import ClientSearchPage from "@/components/ClientSearchPage/ClientSearchPage";
import CoachSearchPage from "@/components/CoachSearchPage/CoachSearchPage";

import { auth } from "@/services/auth";
import { getCoachProfiles, getProfileByUserId } from "@/services/apiProfiles";
import { getBlockedProfiles } from "@/services/apiBlockedProfiles";

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

  const coaches = await getCoachProfiles(await searchParams);
  const blockedProfiles = await getBlockedProfiles(session.user.id);

  return (
    <main className={styles.main}>
      {userProfile.role === "client" ? (
        <ClientSearchPage
          coaches={coaches}
          blockedProfiles={blockedProfiles}
          session={session}
          userProfile={userProfile}
        />
      ) : (
        <CoachSearchPage
          session={session}
          isSearching={userProfile.isSearching}
          userProfile={userProfile}
        />
      )}
    </main>
  );
};

export default Page;

// Fix bug when isSearching is true even though the coach closed the window
// Fix online statuses (sometimes disappear after some time has passed)
// Fix notifications error (when deleting messages)
// Add rating functionality
