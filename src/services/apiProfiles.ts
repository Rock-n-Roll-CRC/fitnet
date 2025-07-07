import { supabase } from "@/services/supabase";

export const getProfileByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error(error.message);
    throw new Error(`Failed to fetch user's profile: ${error.message}`);
  }

  return data;
};

export const getCoachProfiles = async (filters?: {
  gender?: string;
  minAge?: string;
  maxAge?: string;
}) => {
  let query = supabase.from("profiles").select("*").eq("role", "coach");

  if (filters?.gender) {
    query = query.eq("gender", filters.gender);
  }

  if (filters?.minAge) {
    query = query.gte("age", filters.minAge);
  }

  if (filters?.maxAge) {
    query.lte("age", filters.maxAge);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error.message);
    throw new Error(`Failed to fetch coaches' profiles: ${error.message}`);
  }

  return data;
};
