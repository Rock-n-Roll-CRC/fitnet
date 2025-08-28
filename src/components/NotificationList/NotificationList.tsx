import type { Tables } from "@/types/database";

import NotificationGroup from "@/components//NotificationGroup/NotificationGroup";

import { getDateGroupLabel } from "@/utilities/helpers";

import styles from "./NotificationList.module.scss";

export default function NotificationList({
  notifications,
}: {
  notifications: (Tables<"notifications"> & {
    senderProfile: Tables<"profiles">;
  })[];
}) {
  const notificationGroups = notifications
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .reduce(
      (
        accum: {
          label: string;
          notifications: (Tables<"notifications"> & {
            senderProfile: Tables<"profiles">;
          })[];
        }[],
        el,
      ) => {
        const dateGroupLabel = getDateGroupLabel(new Date(el.created_at));
        const group = accum.find((group) => group.label === dateGroupLabel);

        if (group) {
          group.notifications.push(el);
        } else {
          accum.push({ label: dateGroupLabel, notifications: [el] });
        }

        return accum;
      },
      [],
    );

  return (
    <ul className={styles["notification-list"]}>
      {notificationGroups.map((notificationGroup) => (
        <NotificationGroup
          key={notificationGroup.label}
          notificationGroup={notificationGroup}
        />
      ))}
    </ul>
  );
}
