import { supabase } from "@/services/supabase";
import type { Tables } from "@/types/database";

export const getNotifications = async (
  userId: string,
  filters?: {
    status: "all" | "unread" | "read";
    types: ("messages" | "requests" | "reviews")[];
    startDate?: string | undefined;
    endDate?: string | undefined;
  },
) => {
  let query = supabase
    .from("notifications")
    .select("*, senderProfile: profiles!sender_id(*)")
    .eq("user_id", userId);

  if (filters?.status) {
    const filterStatuses =
      filters.status === "read"
        ? [true]
        : filters.status === "unread"
          ? [false]
          : [true, false];

    query = query.in("is_read", filterStatuses);
  }
  if (filters?.types) {
    const filterTypes = filters.types.flatMap(
      (el): Tables<"notifications">["type"][] =>
        el === "messages"
          ? ["NEW_MESSAGE"]
          : el === "reviews"
            ? ["NEW_REVIEW"]
            : ["REQUEST_RECEIVED", "REQUEST_ACCEPTED"],
    );

    query = query.in("type", filterTypes);
  }

  const { data, error } = await query;

  if (error)
    throw new Error(`Failed to get notifications: ${error.message}`, {
      cause: error.cause,
    });

  return data;
};
