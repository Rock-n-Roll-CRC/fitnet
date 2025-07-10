import { auth } from "@/services/auth";
import { getSavedProfiles } from "@/services/apiSavedProfiles";
import SavedProfileItem from "@/components/SavedProfileItem/SavedProfileItem";

import styles from "./page.module.scss";

const Page = async () => {
  const session = await auth();

  if (!session) return;

  const savedProfiles = await getSavedProfiles(session.user.id);

  return (
    <main className={styles.main}>
      {savedProfiles.map(({ profile: savedProfile }) => (
        <SavedProfileItem
          key={savedProfile.user_id}
          savedProfile={savedProfile}
        />
      ))}
    </main>
  );
};

export default Page;
