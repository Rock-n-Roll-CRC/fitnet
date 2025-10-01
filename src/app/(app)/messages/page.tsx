import MessagesHeader from "@/components/MessagesHeader/MessagesHeader";
import ActiveChats from "@/components/ActiveChats/ActiveChats";

import { auth } from "@/services/auth";
import { getActiveChats } from "@/services/apiMessages";
import { getSavedProfiles } from "@/services/apiSavedProfiles";

import styles from "./page.module.scss";

export default async function Page() {
  const session = await auth();

  if (!session) return;

  const activeChats = await getActiveChats(session.user.id);
  const savedProfiles = await getSavedProfiles(session.user.id);

  return (
    <div className={styles["page-content"]}>
      <MessagesHeader />

      <ActiveChats
        session={session}
        activeChats={activeChats}
        savedProfiles={savedProfiles}
      />
    </div>
  );
}
