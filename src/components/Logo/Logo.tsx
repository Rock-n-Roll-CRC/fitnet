import LogoSVG from "@/assets/logo.svg";

import styles from "./Logo.module.scss";

const Logo = () => {
  return (
    <div className={styles.logo}>
      <LogoSVG className={styles.logo__icon} />
      <span className={styles.logo__caption}>FitNet</span>
    </div>
  );
};

export default Logo;
