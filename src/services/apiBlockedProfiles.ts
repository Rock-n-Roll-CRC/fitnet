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
