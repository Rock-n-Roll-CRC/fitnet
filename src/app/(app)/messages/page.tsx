import ActiveChats from "@/components/ActiveChats/ActiveChats";
import EmptyChats from "@/components/EmptyChats/EmptyChats";

import { auth } from "@/services/auth";
import { getActiveChats } from "@/services/apiMessages";

export default async function Page() {
  const session = await auth();

  if (!session) return;

  const activeChats = await getActiveChats(session.user.id);

  return (
    <>
      {activeChats.length > 0 ? (
        <ActiveChats session={session} activeChats={activeChats} />
      ) : (
        <EmptyChats />
      )}
    </>
  );
}

// Add "is_read" functionality for messages
