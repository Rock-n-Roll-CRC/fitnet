import type { ReactNode } from "react";

import styles from "./layout.module.scss";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className={styles.main}>
      <div className={styles.main__content}>{children}</div>
    </main>
  );
}
