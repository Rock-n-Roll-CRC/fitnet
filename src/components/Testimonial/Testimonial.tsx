import type { JSX } from "react";

import QuotationMarkSVG from "@/assets/icons/quotation-mark.svg";

import styles from "./Testimonial.module.scss";

const Testimonial = ({
  testimonial,
  isSelected,
}: {
  testimonial: {
    author: {
      name: string;
      country: string;
    };
    description: JSX.Element;
    label: string;
  };
  isSelected: boolean;
}) => {
  return (
    <li
      className={`${styles.testimonial ?? ""} ${isSelected ? (styles["testimonial--selected"] ?? "") : ""}`}
    >
      <div className={styles["testimonial__upper-container"]}>
        <QuotationMarkSVG className={styles["testimonial__quotation-mark"]} />
        <p className={styles.testimonial__description}>
          {testimonial.description}
        </p>
      </div>

      <div className={styles["testimonial__bottom-container"]}>
        <span className={styles.testimonial__author}>
          {`${testimonial.author.name}, ${testimonial.author.country}`}
        </span>
        <span className={styles.testimonial__label}>{testimonial.label}</span>
      </div>
    </li>
  );
};

export default Testimonial;
