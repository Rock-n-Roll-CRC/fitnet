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
  const myProfile = await getProfileByUserId(session.user.id);

  if (!profile || !myProfile) return;

  const messages = await getMessages(userId);

  return (
    <div className={styles["page-content"]}>
      <Chat
        session={session}
        profile={profile}
        myProfile={myProfile}
        messages={messages}
      />
    </div>
  );
}
