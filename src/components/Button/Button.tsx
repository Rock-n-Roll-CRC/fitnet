import type { FC, ReactNode, SVGProps } from "react";

import Link from "next/link";

import styles from "./Button.module.scss";

const Button = ({
  type,
  icon: Icon,
  location,
  children,
}: {
  type?: "call-to-action";
  icon?: FC<SVGProps<SVGElement>>;
  location?: "header";
  children: ReactNode;
}) => {
  return type ? (
    <Link
      href="login"
      className={`${styles.button ?? ""} ${styles[`button--type-${type}`] ?? ""} ${location ? (styles[`button--location-${location}`] ?? "") : ""}`}
    >
      <span className={styles.button__caption}>{children}</span>
      {Icon && <Icon className={styles.button__icon} />}
    </Link>
  ) : (
    <button
      className={`${styles.button ?? ""}  ${location ? (styles[`button--location-${location}`] ?? "") : ""}`}
    >
      <span className={styles.button__caption}>{children}</span>
      {Icon && <Icon className={styles.button__icon} />}
    </button>
  );
};

export default Button;
