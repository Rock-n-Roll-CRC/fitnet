import Button from "@/components/Button/Button";

import ArrowForwardSVG from "@/assets/icons/arrow-forward.svg";

import styles from "./Hero.module.scss";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <h2 className={styles.hero__heading}>
        The all-in-one tool you&apos;ll enjoy using
      </h2>

      <p className={styles.hero__description}>
        FitNet helps coaches find their clients, track the reserved training
        sessions, set their working schedule and more!
      </p>

      <Button type="call-to-action" icon={ArrowForwardSVG}>
        Sign up for free
      </Button>
    </section>
  );
};

export default Hero;
