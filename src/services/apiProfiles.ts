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

export const getProfiles = async (
  role: "client" | "coach",
  filters?: {
    distance: number;
    gender: ("male" | "female")[];
    minAge: number;
    maxAge: number;
    expertise: ("muscle growth" | "weight loss" | "yoga")[];
    fitnessGoal: ("muscle growth" | "weight loss" | "yoga")[];
  },
) => {
  let query = (await import("@/services/supabase")).supabase
    .from("profiles")
    .select("*, ratings: reviews!ratee_id(*)")
    .eq("role", role)
    .eq("isSearching", true);

  if (filters?.gender) {
    query = query.in("gender", filters.gender);
  }

  if (filters?.expertise && role === "coach") {
    query = query.overlaps("expertise", filters.expertise);
  }

  if (filters?.fitnessGoal && role === "client") {
    query = query.in("fitness_goal", filters.fitnessGoal);
  }

  const { data, error } = await query;

  if (error) {
    console.error(error.message);
    throw new Error(`Failed to fetch profiles: ${error.message}`);
  }

  return data;
};
