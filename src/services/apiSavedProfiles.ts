import { supabase } from "@/services/supabase";

export const getSavedProfiles = async (userId: string) => {
  const { data, error } = await supabase
    .from("saved_profiles")
    .select(
      "*, saverProfile: profiles!saver_user_id(*, ratings: ratings!ratee_id(*)), savedProfile: profiles!saved_user_id(*, ratings: ratings!ratee_id(*))",
    )
    .or(`saver_user_id.eq.${userId},saved_user_id.eq.${userId}`);

  if (error) {
    console.error(`Failed to get saved profiles: ${error.message}`);
    throw new Error(`Failed to get saved profiles: ${error.message}`, {
      cause: error.cause,
    });
  }

  return data;
};

export const isConnected = async (userId1: string, userId2: string) => {
  const { data, error } = await supabase
    .from("saved_profiles")
    .select()
    .or(
      `and(saver_user_id.eq.${userId1},saved_user_id.eq.${userId2}),and(saver_user_id.eq.${userId2},saved_user_id.eq.${userId1})`,
    )
    .maybeSingle();

  if (error)
    throw new Error(`Failed to check isConnected: ${error.message}`, {
      cause: error.cause,
    });

  return !!data;
};
