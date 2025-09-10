import type { ReactNode } from "react";

import MessagesHeader from "@/components/MessagesHeader/MessagesHeader";

import styles from "./layout.module.scss";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className={styles.main}>
      <MessagesHeader />

      <div className={styles.main__content}>{children}</div>
    </main>
  );
}
