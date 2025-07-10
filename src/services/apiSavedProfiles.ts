import { supabase } from "@/services/supabase";

export const getSavedProfiles = async (userId: string) => {
  const { data, error } = await supabase
    .from("saved_profiles")
    .select("*, profile: profiles!saved_user_id(*)")
    .eq("saver_user_id", userId);

  if (error) {
    console.error(`Failed to get saved profiles: ${error.message}`);
    throw new Error(`Failed to get saved profiles: ${error.message}`, {
      cause: error.cause,
    });
  }

  return data;
};

export const getSaverProfiles = async (userId: string) => {
  const { data, error } = await supabase
    .from("saved_profiles")
    .select("*, profile: profiles!saver_user_id(*)")
    .eq("saved_user_id", userId);

  if (error) {
    console.error(`Failed to get saving profiles: ${error.message}`);
    throw new Error(`Failed to get saving profiles: ${error.message}`, {
      cause: error.cause,
    });
  }

  return data;
};
