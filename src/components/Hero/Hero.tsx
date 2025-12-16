import Image from "next/image";

import Button from "@/components/Button/Button";

import hero from "@/assets/images/hero.webp";

import ArrowForwardSVG from "@/assets/icons/arrow-forward-outline.svg";

import styles from "./Hero.module.scss";

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.hero__body}>
        <h2 className={styles.hero__heading}>
          Where&apos;s your next fitness breakthrough hiding?
        </h2>

        <p className={styles.hero__description}>
          With FitNet, connecting with the right coach is as easy as exploring a
          map. Browse local coaches, chat instantly, and start your fitness
          journey today.
        </p>

        <Button type="call-to-action" icon={ArrowForwardSVG}>
          Sign up for free
        </Button>
      </div>

      <Image
        src={hero}
        alt="Portrait of a woman holding a dumbbell"
        className={styles.hero__image}
      />
    </section>
  );
};

export default Hero;
