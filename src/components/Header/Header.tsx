import type { ReactNode } from "react";

import styles from "./Header.module.scss";

const Header = ({ children }: { children: ReactNode }) => {
  return <header className={styles.header}>{children}</header>;
};

const Container = ({ children }: { children: ReactNode }) => {
  return <div className={styles.header__container}>{children}</div>;
};

Header.Container = Container;

export default Header;
