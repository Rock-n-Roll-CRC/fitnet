import Link from "next/link";

import Logo from "@/components/Logo/Logo";
import Button from "@/components/Button/Button";

import LogoFacebookSVG from "@/assets/icons/logo-facebook.svg";
import LogoTwitterSVG from "@/assets/icons/logo-twitter.svg";
import LogoLinkedInSVG from "@/assets/icons/logo-linkedin.svg";

import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__wrapper}>
        <div className={styles.footer__body}>
          <div className={styles["footer__cta-block"]}>
            <Logo />
            <Button type="call-to-action">Get Started</Button>
          </div>

          <div className={styles["footer__info-row"]}>
            <div className={styles["footer__info-column"]}>
              <h3 className={styles["footer__column-heading"]}>Contact me</h3>
              <div className={styles["footer__credentials-container"]}>
                <Link href="tel:84354290441" className={styles.footer__contact}>
                  +84 354 290 441
                </Link>
                <Link
                  href="mailto:danil.dikhtyar@gmail.com"
                  className={styles.footer__contact}
                >
                  danil.dikhtyar@gmail.com
                </Link>
              </div>
            </div>

            <div className={styles["footer__info-column"]}>
              <h3 className={styles["footer__column-heading"]}>Follow me</h3>
              <div className={styles["footer__logo-container"]}>
                <Link href="https://x.com/Rock_n_Roll_CRC" target="_blank">
                  <LogoTwitterSVG className={styles.footer__logo} />
                </Link>
                <Link
                  href="https://www.facebook.com/RockAndRollCRC/"
                  target="_blank"
                >
                  <LogoFacebookSVG className={styles.footer__logo} />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/rock-n-roll-crc/"
                  target="_blank"
                >
                  <LogoLinkedInSVG className={styles.footer__logo} />
                </Link>
              </div>
            </div>
          </div>

          <p className={styles.footer__copyright}>
            &copy; Copyright {new Date().getFullYear()} by FitNet.
            <br />
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
