import MoonSVG from "@/assets/icons/moon.svg";

import styles from "./ColorThemeSwitcher.module.scss";

const ColorThemeSwitcher = () => {
  return (
    <button className={styles["color-theme-switcher"]}>
      <MoonSVG className={styles["color-theme-switcher__icon"]} />
    </button>
  );
};

export default ColorThemeSwitcher;
