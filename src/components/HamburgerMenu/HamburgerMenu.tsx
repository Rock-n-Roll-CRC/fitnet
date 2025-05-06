import MenuSVG from "@/assets/icons/menu-outline.svg";

import styles from "./HamburgerMenu.module.scss";

const HamburgerMenu = () => {
  return (
    <div className={styles["hamburger-menu"]}>
      <MenuSVG className={styles["hamburger-menu__icon"]} />
    </div>
  );
};

export default HamburgerMenu;
