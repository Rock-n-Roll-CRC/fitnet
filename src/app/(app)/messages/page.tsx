import ActiveChats from "@/components/ActiveChats/ActiveChats";
import EmptyState from "@/components/EmptyState/EmptyState";

import { auth } from "@/services/auth";
import { getActiveChats } from "@/services/apiMessages";

import BubbleChatSVG from "@/assets/icons/bubble-chat.svg";

export default async function Page() {
  const session = await auth();

  if (!session) return;

  const activeChats = await getActiveChats(session.user.id);

  return (
    <>
      {activeChats.length > 0 ? (
        <ActiveChats session={session} activeChats={activeChats} />
      ) : (
        <EmptyState
          illustration={BubbleChatSVG}
          illustrationType="shorter"
          heading={<>Start a new conversation!</>}
          description={
            <>
              Tap the button below to begin chatting with someone! You never
              know what interesting conversations might come up!
            </>
          }
          ctaText={<>Send a Message</>}
          ctaLink="/messages/start"
        />
      )}
    </>
  );
}

// Add "is_read" functionality for messages
