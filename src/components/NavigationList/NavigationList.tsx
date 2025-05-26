import Link from "next/link";

import styles from "./NavigationList.module.scss";

const NavigationList = ({
  location,
  linkOnClick,
}: {
  location?: "hamburger-menu" | "header";
  linkOnClick?: () => void;
}) => {
  return (
    <nav
      className={`${styles["navigation-list"] ?? ""} ${location ? (styles[`navigation-list--location-${location}`] ?? "") : ""}  `}
    >
      <ul className={styles["navigation-list__link-list"]}>
        <li>
          <Link
            href="#features"
            onClick={linkOnClick}
            className={styles["navigation-list__link"]}
          >
            Features
          </Link>
        </li>
        <li>
          <Link
            href="#how-it-works"
            onClick={linkOnClick}
            className={styles["navigation-list__link"]}
          >
            How It Works
          </Link>
        </li>
        <li>
          <Link
            href="#testimonials"
            onClick={linkOnClick}
            className={styles["navigation-list__link"]}
          >
            Testimonials
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavigationList;
