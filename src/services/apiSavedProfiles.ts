import { supabase } from "@/services/supabase";

export const getSavedProfiles = async (userId: string) => {
  const { data, error } = await supabase
    .from("saved_profiles")
    .select(
      "*, saverProfile: profiles!saver_user_id(*), savedProfile: profiles!saved_user_id(*)",
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
