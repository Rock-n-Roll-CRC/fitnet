import type { FC, ReactNode, SVGProps } from "react";

import styles from "./Feature.module.scss";

const Feature = ({ children }: { children: ReactNode }) => {
  return <li className={styles.feature}>{children}</li>;
};

const Icon = ({ icon: Icon }: { icon: FC<SVGProps<SVGElement>> }) => {
  return (
    <div className={styles["feature__icon-wrapper"]}>
      <Icon className={styles.feature__icon} />
    </div>
  );
};

const TextContent = ({ children }: { children: ReactNode }) => {
  return <div className={styles["feature__text-content"]}>{children}</div>;
};

const Heading = ({ children }: { children: ReactNode }) => {
  return <h3 className={styles.feature__heading}>{children}</h3>;
};

const Description = ({ children }: { children: ReactNode }) => {
  return <p className={styles.feature__description}>{children}</p>;
};

Feature.Icon = Icon;
Feature.TextContent = TextContent;
Feature.Heading = Heading;
Feature.Description = Description;

export default Feature;
