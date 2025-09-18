import type { Tables } from "@/types/database";

export const getActiveChats = async (
  userId: string,
  type: "server" | "client" = "server",
) => {
  const client =
    type === "server"
      ? (await import("@/services/supabase")).supabase
      : (await import("@/services/supabase.client")).supabaseClient;

  const { data, error } = await client
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

export const getMessages = async (userId: string) => {
  const client = (await import("@/services/supabase")).supabase;

  const { data, error } = await client
    .from("messages")
    .select(
      "*, senderProfile: profiles!sender_id(*), receiverProfile: profiles!receiver_id(*)",
    )
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: true });

  if (error)
    throw new Error(`Failed to get messages: ${error.message}`, {
      cause: error.cause,
    });

  return data;
};

export const getMessage = async (id: string) => {
  const { data, error } = await (await import("@/services/supabase")).supabase
    .from("messages")
    .select(
      "*, senderProfile: profiles!sender_id(*), receiverProfile: profiles!receiver_id(*)",
    )
    .eq("id", id)
    .single();

  if (error)
    throw new Error(`Failed to get the message: ${error.message}`, {
      cause: error.cause,
    });

  return data;
};

export const readMessage = async (id: string) => {
  const { error } = await (
    await import("@/services/supabase.client")
  ).supabaseClient
    .from("messages")
    .update({ is_read: true })
    .eq("id", id);

  if (error) throw new Error(`Failed to read a message: ${error.message}`);
};

export const getUnreadMessagesCount = async (userId: string) => {
  const { count, error } = await (await import("@/services/supabase")).supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("receiver_id", userId)
    .eq("is_read", false);

  if (error)
    throw new Error(`Failed to get unread messages count: ${error.message}`);

  return count ?? 0;
};
