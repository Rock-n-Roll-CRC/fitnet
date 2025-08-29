import FeelingLonelySVG from "@/assets/illustrations/feeling-lonely.svg";

import styles from "./EmptyState.module.scss";

export default function EmptyState() {
  return (
    <div className={styles["empty-state"]}>
      <FeelingLonelySVG className={styles["empty-state__illustration"]} />

      <div className={styles["empty-state__content"]}>
        <p className={styles["empty-state__heading"]}>
          Looks like you have no friends!
        </p>
        <p className={styles["empty-state__description"]}>
          As you add friends, they will appear here.
        </p>
      </div>
    </div>
  );
}
