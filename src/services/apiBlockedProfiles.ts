import { supabase } from "@/services/supabase";

export const isBlocked = async (blockerId: string, blockedId: string) => {
  const { data, error } = await supabase
    .from("blocked_profiles")
    .select()
    .eq("blocker_id", blockerId)
    .eq("blocked_id", blockedId)
    .maybeSingle();

  if (error)
    throw new Error(`Failed to check isBlocked: ${error.message}`, {
      cause: error.cause,
    });

  return !!data;
};

export const getBlockedProfiles = async (userId: string) => {
  const { data, error } = await supabase
    .from("blocked_profiles")
    .select(
      "*, blockerProfile: profiles!blocker_id(*), blockedProfile: profiles!blocked_id(*)",
    )
    .eq("blocker_id", userId);

  if (error)
    throw new Error(`Failed to get blocked profiles: ${error.message}`, {
      cause: error.cause,
    });

  return data;
};
