import Button from "@/components/Button/Button";

import ArrowForwardSVG from "@/assets/icons/arrow-forward-outline.svg";

import styles from "./Hero.module.scss";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <h2 className={styles.hero__heading}>
        Curious how one tool can boost your productivity?
      </h2>

      <p className={styles.hero__description}>
        With FitNet, coaches can establish a convenient, time-saving workflow
        that makes their business scale.
      </p>

      <Button type="call-to-action" icon={ArrowForwardSVG}>
        Sign up for free
      </Button>
    </section>
  );
};

export default Hero;
