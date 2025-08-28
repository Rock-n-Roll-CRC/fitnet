import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import Profile from "@/components/Profile/Profile";

import { auth } from "@/services/auth";
import { getProfileByUserId } from "@/services/apiProfiles";
import { isBlocked } from "@/services/apiBlockedProfiles";
import { isConnected } from "@/services/apiSavedProfiles";
import { isRequestSent } from "@/services/apiConnectionRequests";

import styles from "./page.module.scss";

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const session = await auth();

  if (!session) return;

  const profile = await getProfileByUserId((await params).userId);

  if (!profile) return;

  const tab = (await searchParams).tab ?? "about";
  const sort = (await searchParams).sort ?? "desc";

  const isProfileBlocked = await isBlocked(session.user.id, profile.user_id);
  const isProfileConnected = await isConnected(
    session.user.id,
    profile.user_id,
  );
  const isRequestSentVar = await isRequestSent(
    session.user.id,
    profile.user_id,
  );

  return (
    <>
      <ProfileHeader session={session} profile={profile} />

      <main className={styles.main}>
        <Profile
          session={session}
          profile={profile}
          isProfileConnected={isProfileConnected}
          isProfileBlocked={isProfileBlocked}
          isRequestSent={isRequestSentVar}
          tab={tab}
          sort={sort}
        />
      </main>
    </>
  );
};

export default Page;

// Fix empty reviews design
