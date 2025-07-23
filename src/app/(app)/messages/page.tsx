import ActiveChats from "@/components/ActiveChats/ActiveChats";

import { auth } from "@/services/auth";
import { getActiveChats } from "@/services/apiMessages";

import styles from "./page.module.scss";

export default async function Page() {
  const session = await auth();

  if (!session) return;

  const activeChats = await getActiveChats(session.user.id);

  return (
    <main className={styles.main}>
      <ActiveChats session={session} activeChats={activeChats} />
    </main>
  );
}
