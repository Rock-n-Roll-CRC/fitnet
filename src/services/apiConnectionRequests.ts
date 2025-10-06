import { supabase } from "@/services/supabase";

export const getPendingConnectionRequests = async (userId: string) => {
  const { data: blockedIds, error: blockedIdsError } = await supabase
    .from("blocked_profiles")
    .select("blocked_id")
    .eq("blocker_id", userId);

  if (blockedIdsError) {
    console.error(blockedIdsError.message);
    throw new Error(
      `Failed to fetch coaches' profiles: ${blockedIdsError.message}`,
    );
  }

  const { data, error } = await supabase
    .from("connection_requests")
    .select(
      "*, senderProfile: profiles!sender_id(*), receiverProfile: profiles!receiver_id(*)",
    )
    .eq("receiver_id", userId)
    .eq("status", "pending")
    .not(
      "sender_id",
      "in",
      `(${blockedIds.map((blockedId) => blockedId.blocked_id).join(",")})`,
    );

  if (error) {
    console.error(error.message);
    throw new Error(
      `Failed to get pending connection requests: ${error.message}`,
      { cause: error.cause },
    );
  }

  return data;
};

export const getSentPendingConnectionRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from("connection_requests")
    .select(
      "*, senderProfile: profiles!sender_id(*), receiverProfile: profiles!receiver_id(*)",
    )
    .eq("sender_id", userId)
    .eq("status", "pending");

  if (error) {
    console.error(error.message);
    throw new Error(
      `Failed to get sent pending connection requests: ${error.message}`,
      { cause: error.cause },
    );
  }

  return data;
};

export const getConnectionRequest = async (id: string) => {
  const { data, error } = await supabase
    .from("connection_requests")
    .select(
      "*, senderProfile: profiles!sender_id(*), receiverProfile: profiles!receiver_id(*)",
    )
    .eq("id", id)
    .maybeSingle();

  if (error)
    throw new Error(`Failed to get connection request: ${error.message}`, {
      cause: error.cause,
    });

  return data;
};

export const getPendingRequest = async (
  senderId: string,
  receiverId: string,
) => {
  const { data, error } = await supabase
    .from("connection_requests")
    .select(
      "*, senderProfile: profiles!sender_id(*), receiverProfile: profiles!receiver_id(*)",
    )
    .eq("sender_id", senderId)
    .eq("receiver_id", receiverId)
    .eq("status", "pending")
    .maybeSingle();

  if (error)
    throw new Error(`Failed to get pending request: ${error.message}`, {
      cause: error.cause,
    });

  return data;
};
