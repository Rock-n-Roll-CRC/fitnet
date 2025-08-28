import type { Tables } from "@/types/database";

import Notification from "@/components/Notification/Notification";
import MarkAsReadBtn from "@/components/MarkAsReadBtn/MarkAsReadBtn";

import styles from "./NotificationGroup.module.scss";

export default function NotificationGroup({
  notificationGroup: { label, notifications },
}: {
  notificationGroup: {
    label: string;
    notifications: (Tables<"notifications"> & {
      senderProfile: Tables<"profiles">;
    })[];
  };
}) {
  const numberOfMessages = notifications.filter(
    (notification) => notification.type === "NEW_MESSAGE",
  ).length;
  const transformedNotifications = notifications.reduce(
    (
      accum: (Tables<"notifications"> & {
        senderProfile: Tables<"profiles">;
      })[],
      el,
    ) => {
      return el.type === "NEW_MESSAGE" &&
        accum.filter((el) => el.type === "NEW_MESSAGE").length > 0
        ? accum
        : [...accum, el];
    },
    [],
  );

  return (
    <li className={styles["notification-group"]}>
      <div className={styles["notification-group__header"]}>
        <h2 className={styles["notification-group__label"]}>{label}</h2>

        <MarkAsReadBtn notifications={notifications} />
      </div>

      <ul className={styles["notification-group__body"]}>
        {transformedNotifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            numberOfMessages={numberOfMessages}
          />
        ))}
      </ul>
    </li>
  );
}
