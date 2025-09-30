import { clearNotifications, readAllNotifications } from "@/services/actions";

import styles from "./NotificationsActions.module.scss";

export default function NotificationsActions() {
  return (
    <div className={styles["notifications-actions"]}>
      <button
        onClick={() => {
          void readAllNotifications();
        }}
        className={styles["notifications-actions__button"]}
      >
        Read all
      </button>

      <button
        onClick={() => {
          void clearNotifications();
        }}
        className={`${styles["notifications-actions__button"] ?? ""} ${styles["notifications-actions__button--danger"] ?? ""}`}
      >
        Clear all
      </button>
    </div>
  );
}
