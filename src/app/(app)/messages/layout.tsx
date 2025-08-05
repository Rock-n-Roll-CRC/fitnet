import type { ReactNode } from "react";

import MessagesHeader from "@/components/MessagesHeader/MessagesHeader";

import styles from "./page.module.scss";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <main className={styles.main}>
      <MessagesHeader />

      {children}
    </main>
  );
}
