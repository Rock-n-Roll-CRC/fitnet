import ClientSearchPage from "@/components/ClientSearchPage/ClientSearchPage";
import CoachSearchPage from "@/components/CoachSearchPage/CoachSearchPage";

import { auth } from "@/services/auth";
import { getCoachProfiles, getProfileByUserId } from "@/services/apiProfiles";
import { getBlockedProfiles } from "@/services/apiBlockedProfiles";

import styles from "./page.module.scss";

const Page = async () => {
  const session = await auth();

  if (!session) return;

  const userProfile = await getProfileByUserId(session.user.id);

  if (!userProfile) return;

  const coaches = await getCoachProfiles();
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
        <CoachSearchPage session={session} userProfile={userProfile} />
      )}
    </main>
  );
};

export default Page;
