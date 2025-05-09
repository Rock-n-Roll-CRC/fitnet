import type { FC, ReactNode, SVGProps } from "react";

import styles from "./Step.module.scss";

const Step = ({
  step: { number, heading, description, illustration },
}: {
  step: {
    number: number;
    heading: string;
    description: ReactNode;
    illustration:
      | FC<SVGProps<SVGElement>>
      | { value: FC<SVGProps<SVGElement>>; isHorizontal: boolean };
  };
}) => {
  const { value: Illustration, isHorizontal } =
    typeof illustration === "function"
      ? { value: illustration, isHorizontal: false }
      : illustration;

  return (
    <li className={styles.step}>
      <div className={styles.step__body}>
        <div className={styles["step__heading-wrapper"]}>
          <div className={styles.step__number}>{number}</div>
          <h3 className={styles.step__heading}>{heading}</h3>
        </div>
        <p className={styles.step__description}>{description}</p>
      </div>
      <Illustration
        className={`${styles.step__illustration ?? ""} ${isHorizontal ? (styles["step__illustration--horizontal"] ?? "") : ""}`}
      />
    </li>
  );
};

export default Step;
