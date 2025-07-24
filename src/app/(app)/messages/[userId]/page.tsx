import Chat from "@/components/Chat/Chat";

import { auth } from "@/services/auth";
import { getProfileByUserId } from "@/services/apiProfiles";
import { getMessages } from "@/services/apiMessages";

import styles from "./page.module.scss";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  if (!userId) return;

  const session = await auth();

  if (!session) return;

  const profile = await getProfileByUserId(userId);

  if (!profile) return;

  const messages = await getMessages(userId);

  return (
    <main className={styles.main}>
      <Chat session={session} profile={profile} messages={messages} />
    </main>
  );
}
