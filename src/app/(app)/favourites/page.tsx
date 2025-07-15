import ProfileItem from "@/components/ProfileItem/ProfileItem";
import RequestItem from "@/components/RequestItem/RequestItem";

import { auth } from "@/services/auth";
import { getProfileByUserId } from "@/services/apiProfiles";
import { getSavedProfiles } from "@/services/apiSavedProfiles";
import {
  getPendingConnectionRequests,
  getSentPendingConnectionRequests,
} from "@/services/apiConnectionRequests";

import styles from "./page.module.scss";

const Page = async () => {
  const session = await auth();

  if (!session) return;

  const profile = await getProfileByUserId(session.user.id);

  if (!profile) return;

  const savedProfiles = await getSavedProfiles(session.user.id);

  const pendingConnectionRequests = await getPendingConnectionRequests(
    session.user.id,
  );
  const sentPendingConnectionRequests = await getSentPendingConnectionRequests(
    session.user.id,
  );

  return (
    <main className={styles.main}>
      {savedProfiles.map(({ saverProfile, savedProfile }) => (
        <ProfileItem
          key={profile.user_id}
          profile={
            session.user.id === saverProfile.user_id
              ? savedProfile
              : saverProfile
          }
        />
      ))}

      <hr />

      {pendingConnectionRequests.map((request, index) => (
        <RequestItem key={index} request={request} type="received" />
      ))}

      {sentPendingConnectionRequests.map((request, index) => (
        <RequestItem key={index} request={request} type="sent" />
      ))}
    </main>
  );
};

export default Page;
