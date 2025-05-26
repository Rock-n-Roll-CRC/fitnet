import type { ReactNode } from "react";
import type { StaticImageData } from "next/image";

import Image from "next/image";

import styles from "./FeatureBlock.module.scss";

const FeatureBlock = ({ children }: { children: ReactNode }) => {
  return <article className={styles["feature-block"]}>{children}</article>;
};

const Body = ({ children }: { children: ReactNode }) => {
  return <div className={styles["feature-block__body"]}>{children}</div>;
};

const TextContent = ({ children }: { children: ReactNode }) => {
  return (
    <div className={styles["feature-block__text-content"]}>{children}</div>
  );
};

const Heading = ({ children }: { children: ReactNode }) => {
  return <h2 className={styles["feature-block__heading"]}>{children}</h2>;
};

const Description = ({ children }: { children: ReactNode }) => {
  return <p className={styles["feature-block__description"]}>{children}</p>;
};

const Picture = ({ image, alt }: { image: StaticImageData; alt: string }) => {
  return (
    <Image src={image} alt={alt} className={styles["feature-block__picture"]} />
  );
};

const FeatureList = ({ children }: { children: ReactNode }) => {
  return <ul className={styles["feature-block__feature-list"]}>{children}</ul>;
};

FeatureBlock.Body = Body;
FeatureBlock.TextContent = TextContent;
FeatureBlock.Heading = Heading;
FeatureBlock.Description = Description;
FeatureBlock.Picture = Picture;
FeatureBlock.FeatureList = FeatureList;

export default FeatureBlock;
