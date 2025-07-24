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
  const client = (await import("@/services/supabase")).supabase;

  let query = client.from("profiles").select("*").eq("role", "coach");

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

export const getNotBlockedCoachProfiles = async (
  userId: string,
  filters?: {
    gender?: string;
    minAge?: string;
    maxAge?: string;
  },
) => {
  const client = (await import("@/services/supabase")).supabase;

  const { data: blockedIds, error: blockedIdsError } = await client
    .from("blocked_profiles")
    .select("blocked_id")
    .eq("blocker_id", userId);

  if (blockedIdsError) {
    console.error(blockedIdsError.message);
    throw new Error(
      `Failed to fetch coaches' profiles: ${blockedIdsError.message}`,
    );
  }

  let query = client
    .from("profiles")
    .select("*")
    .eq("role", "coach")
    .not(
      "user_id",
      "in",
      `(${blockedIds.map((blockedId) => blockedId.blocked_id).join(",")})`,
    );

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
