import { supabase } from "@/services/supabase";

export const getPendingConnectionRequests = async (userId: string) => {
  const { data, error } = await supabase
    .from("connection_requests")
    .select(
      "*, senderProfile: profiles!sender_id(*), receiverProfile: profiles!receiver_id(*)",
    )
    .eq("receiver_id", userId)
    .eq("status", "pending");

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
