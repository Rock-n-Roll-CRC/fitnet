import { supabase } from "@/services/supabase";

export const getSavedProfiles = async (profileId: string) => {
  const { data, error } = await supabase
    .from("saved_profiles")
    .select("*, profile: profiles!saved_profile_id(*)")
    .eq("saver_profile_id", profileId);

  if (error) {
    console.error(`Failed to get saved profiles: ${error.message}`);
    throw new Error(`Failed to get saved profiles: ${error.message}`, {
      cause: error.cause,
    });
  }

  return data;
};
