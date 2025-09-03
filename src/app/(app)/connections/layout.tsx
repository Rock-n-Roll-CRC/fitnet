import type { ReactNode } from "react";

import Tabs from "@/components/Tabs/Tabs";

import styles from "./layout.module.scss";

export default function Page({ children }: { children: ReactNode }) {
  return (
    <main className={styles.main}>
      <Tabs
        tabs={[
          {
            label: "Friends",
            value: "friends",
            icon: "people",
          },
          {
            label: "Requests",
            value: "requests",
            icon: "person-add",
          },
          {
            label: "Blocked",
            value: "blocked",
            icon: "ban",
          },
        ]}
      />

      <div className={styles.main__content}>
        <ul className={styles["main__content-list"]}>{children}</ul>
      </div>
    </main>
  );
}
