import ChatHeader from "@/components/ChatHeader/ChatHeader";
import ChatMain from "@/components/ChatMain/ChatMain";
import ChatFooter from "@/components/ChatFooter/ChatFooter";

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
      <ChatHeader profile={profile} />

      <ChatMain session={session} messages={messages} />

      <ChatFooter profile={profile} />
    </main>
  );
}
