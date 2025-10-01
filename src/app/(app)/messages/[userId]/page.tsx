import ActiveChats from "@/components/ActiveChats/ActiveChats";
import Chat from "@/components/Chat/Chat";

import { auth } from "@/services/auth";
import { getProfileByUserId } from "@/services/apiProfiles";
import { getActiveChats, getMessages } from "@/services/apiMessages";
import { getSavedProfiles } from "@/services/apiSavedProfiles";

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

  const messages = await getMessages(session.user.id, userId);
  const activeChats = await getActiveChats(session.user.id);
  const savedProfiles = await getSavedProfiles(session.user.id);

  return (
    <div className={styles["page-content"]}>
      <ActiveChats
        session={session}
        activeChats={activeChats}
        savedProfiles={savedProfiles}
        type="sidebar"
      />

      <Chat
        session={session}
        profile={profile}
        myProfile={myProfile}
        messages={messages}
      />
    </div>
  );
}
