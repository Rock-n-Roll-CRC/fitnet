import { z } from "zod/v4";

import NotificationsHeader from "@/components/NotificationsHeader/NotificationsHeader";
import NotificationList from "@/components/NotificationList/NotificationList";
import EmptyState from "@/components/EmptyState/EmptyState";

import { auth } from "@/services/auth";
import { getNotifications } from "@/services/apiNotifications";
import { getProfileByUserId } from "@/services/apiProfiles";

import InboxSVG from "@/assets/illustrations/inbox.svg";

const SearchParamsSchema = z.object({
  status: z.enum(["all", "unread", "read"]).default("all"),
  types: z
    .preprocess(
      (val) => (typeof val === "string" ? [val] : val),
      z.array(z.enum(["requests", "messages", "reviews"])),
    )
    .default(["requests", "messages", "reviews"]),
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

  const profile = await getProfileByUserId(session.user.id);

  if (!profile) return;

  const notifications = await getNotifications(session.user.id, filters);

  return (
    <>
      <NotificationsHeader profile={profile} filters={filters} />

      {notifications.length > 0 ? (
        <NotificationList notifications={notifications} />
      ) : (
        <EmptyState
          illustration={InboxSVG}
          illustrationType="short"
          heading={<>No notifications yet</>}
          description={
            <>
              Stay tuned! No updates at the moment, but exciting news could be
              just around the corner.
            </>
          }
        />
      )}
    </>
  );
}
