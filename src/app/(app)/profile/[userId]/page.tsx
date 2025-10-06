import ProfileHeader from "@/components/ProfileHeader/ProfileHeader";
import Profile from "@/components/Profile/Profile";

import { auth } from "@/services/auth";
import { getProfileByUserId } from "@/services/apiProfiles";
import { isBlocked } from "@/services/apiBlockedProfiles";
import { isConnected } from "@/services/apiSavedProfiles";
import { getPendingRequest } from "@/services/apiConnectionRequests";

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
  const myProfile = await getProfileByUserId(session.user.id);

  if (!profile || !myProfile) return;

  const tab = (await searchParams).tab ?? "about";
  const sort = (await searchParams).sort ?? "desc";

  const isProfileBlocked = await isBlocked(session.user.id, profile.user_id);
  const isProfileConnected = await isConnected(
    session.user.id,
    profile.user_id,
  );
  const sentRequest = await getPendingRequest(session.user.id, profile.user_id);
  const receivedRequest = await getPendingRequest(
    profile.user_id,
    session.user.id,
  );

  return (
    <>
      <ProfileHeader />

      <main className={styles.main}>
        <Profile
          session={session}
          profile={profile}
          myProfile={myProfile}
          isProfileConnected={isProfileConnected}
          isProfileBlocked={isProfileBlocked}
          sentRequest={sentRequest}
          receivedRequest={receivedRequest}
          tab={tab}
          sort={sort}
        />
      </main>
    </>
  );
};

export default Page;
