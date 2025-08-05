import InboxSVG from "@/assets/illustrations/inbox.svg";

import styles from "./NotificationsEmpty.module.scss";

export default function NotificationsEmpty() {
  return (
    <div className={styles["notifications-empty"]}>
      <InboxSVG className={styles["notifications-empty__icon"]} />

      <h2 className={styles["notifications-empty__heading"]}>
        No notifications yet
      </h2>

      <p className={styles["notifications-empty__description"]}>
        Stay tuned! No updates at the moment, but exciting news could be just
        around the corner.
      </p>
    </div>
  );
}
