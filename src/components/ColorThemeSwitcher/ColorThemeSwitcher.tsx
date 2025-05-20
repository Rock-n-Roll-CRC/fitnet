"use client";

import { useTheme } from "@/hooks/useTheme";

import MoonSVG from "@/assets/icons/moon-outline.svg";
import SunnySVG from "@/assets/icons/sunny-outline.svg";

import styles from "./ColorThemeSwitcher.module.scss";

const ColorThemeSwitcher = () => {
  const { colorTheme, handleToggleColorTheme } = useTheme();

  const Icon = colorTheme === "light" ? MoonSVG : SunnySVG;

  return (
    <button
      onClick={handleToggleColorTheme}
      className={styles["color-theme-switcher"]}
    >
      <Icon className={styles["color-theme-switcher__icon"]} />
    </button>
  );
};

export default ColorThemeSwitcher;
