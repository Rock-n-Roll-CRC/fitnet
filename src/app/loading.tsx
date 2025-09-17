import LoadingSpinnerSVG from "@/assets/icons/6-dots-scale.svg";

import styles from "./loading.module.scss";

export default function Loading() {
  return (
    <main className={styles.main}>
      <LoadingSpinnerSVG className={styles.loading} />
    </main>
  );
}
