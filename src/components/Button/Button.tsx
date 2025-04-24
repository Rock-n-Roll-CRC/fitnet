import type { FC, ReactNode, SVGProps } from "react";

import styles from "./Button.module.scss";

const Button = ({
  type,
  icon: Icon,
  children,
}: {
  type?: "call-to-action";
  icon?: FC<SVGProps<SVGElement>>;
  children: ReactNode;
}) => {
  return (
    <button
      className={`${styles.button ?? ""} ${type ? (styles[`button--type-${type}`] ?? "") : ""}`}
    >
      <span className={styles.button__caption}>{children}</span>
      {Icon && <Icon className={styles.button__icon} />}
    </button>
  );
};

export default Button;
