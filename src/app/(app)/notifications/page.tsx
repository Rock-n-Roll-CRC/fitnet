import { z } from "zod/v4";

import NotificationsHeader from "@/components/NotificationsHeader/NotificationsHeader";
import NotificationList from "@/components/NotificationList/NotificationList";
import NotificationsEmpty from "@/components/NotificationsEmpty/NotificationsEmpty";

import { auth } from "@/services/auth";
import { getNotifications } from "@/services/apiNotifications";

const SearchParamsSchema = z.object({
  status: z.enum(["all", "unread", "read"]).default("all"),
  types: z
    .preprocess(
      (val) => (typeof val === "string" ? [val] : val),
      z.array(z.enum(["requests", "messages"])),
    )
    .default(["requests", "messages"]),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = SearchParamsSchema.parse(await searchParams);

  const session = await auth();

  if (!session) return;

  const notifications = await getNotifications(session.user.id, filters);

  return (
    <>
      <NotificationsHeader filters={filters} />

      {notifications.length > 0 ? (
        <NotificationList notifications={notifications} />
      ) : (
        <NotificationsEmpty />
      )}
    </>
  );
}
