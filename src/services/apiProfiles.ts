export const getProfileByUserId = async (
  userId: string,
  type: "server" | "client" = "server",
) => {
  const client =
    type === "server"
      ? (await import("@/services/supabase")).supabase
      : (await import("@/services/supabase.client")).supabaseClient;

  const { data, error } = await client
    .from("profiles")
    .select(
      "*, ratings: reviews!ratee_id(*, raterProfile: profiles!rater_id(*))",
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error(error.message);
    throw new Error(`Failed to fetch user's profile: ${error.message}`);
  }

  return data;
};

export const getCoachProfiles = async () => {
  const client = (await import("@/services/supabase")).supabase;

  const query = client
    .from("profiles")
    .select("*, ratings: reviews!ratee_id(*)")
    .eq("role", "coach");

  const { data, error } = await query;

  if (error) {
    console.error(error.message);
    throw new Error(`Failed to fetch coaches' profiles: ${error.message}`);
  }

  return data;
};
