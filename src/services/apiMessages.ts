import type { Tables } from "@/types/database";

import { supabase } from "@/services/supabase";

export const getActiveChats = async (userId: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select(
      "*, senderProfile: profiles!sender_id(*), receiverProfile: profiles!receiver_id(*)",
    )
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Failed to get active chats: ${error.message}`);

  const activeChatsMap = new Map<
    string,
    { chatPartnerProfile: Tables<"profiles">; lastMessage: Tables<"messages"> }
  >();

  for (const message of data) {
    const chatPartnerProfile =
      userId === message.sender_id
        ? message.receiverProfile
        : message.senderProfile;

    if (!activeChatsMap.has(chatPartnerProfile.user_id)) {
      activeChatsMap.set(chatPartnerProfile.user_id, {
        chatPartnerProfile,
        lastMessage: message,
      });
    }
  }

  return Array.from(activeChatsMap).map(
    ([_, { chatPartnerProfile, lastMessage }]) => {
      return { chatPartnerProfile, lastMessage };
    },
  );
};
