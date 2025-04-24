import type { ReactNode } from "react";

import styles from "./Main.module.scss";

const Main = ({ children }: { children: ReactNode }) => {
  return <main className={styles.main}>{children}</main>;
};

export default Main;
