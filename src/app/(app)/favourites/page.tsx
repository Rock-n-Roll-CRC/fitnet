import ProfileItem from "@/components/ProfileItem/ProfileItem";

import { auth } from "@/services/auth";
import { getProfileByUserId } from "@/services/apiProfiles";
import {
  getSavedProfiles,
  getSaverProfiles,
} from "@/services/apiSavedProfiles";

import styles from "./page.module.scss";

const Page = async () => {
  const session = await auth();

  if (!session) return;

  const profile = await getProfileByUserId(session.user.id);

  if (!profile) return;

  const displayedProfiles =
    profile.role === "client"
      ? await getSavedProfiles(session.user.id)
      : profile.role === "coach"
        ? await getSaverProfiles(session.user.id)
        : null;

  return (
    <main className={styles.main}>
      {displayedProfiles?.map(({ profile }) => (
        <ProfileItem key={profile.user_id} profile={profile} />
      ))}
    </main>
  );
};

export default Page;
