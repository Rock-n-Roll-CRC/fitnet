import { supabase } from "@/services/supabase";

export const getReview = async (id: string) => {
  const { data, error } = await supabase
    .from("reviews")
    .select("*, raterProfile: profiles!rater_id(*)")
    .eq("id", id)
    .maybeSingle();

  if (error)
    throw new Error(`Failed to get review: ${error.message}`, {
      cause: error.cause,
    });

  return data;
};
