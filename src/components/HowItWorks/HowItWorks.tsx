import Step from "@/components/Step/Step";

import MyLocationSVG from "@/assets/illustrations/my-location.svg";
import OnlineMessagingSVG from "@/assets/illustrations/online-messaging.svg";
import PersonalTrainingSVG from "@/assets/illustrations/personal-training.svg";

import styles from "./HowItWorks.module.scss";

const steps = [
  {
    heading: "Find your coach",
    description: (
      <>
        Explore the interactive map to discover qualified coaches near you.
        Filter by expertise, location radius, and gender to find your perfect
        trainer.
      </>
    ),
    illustration: MyLocationSVG,
  },
  {
    heading: "Connect and chat",
    description: (
      <>
        Send a connection request and message your coach directly through our
        built-in chat. Discuss your goals, availability, and other things — all
        within the platform.
      </>
    ),
    illustration: OnlineMessagingSVG,
  },
  {
    heading: "Train and review",
    description: (
      <>
        Meet your coach at your chosen location and work towards your fitness
        goals. After your sessions, leave a rating to help others in the
        community find great trainers.
      </>
    ),
    illustration: { value: PersonalTrainingSVG, isHorizontal: true },
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className={styles["how-it-works"]}>
      <h2 className={styles["how-it-works__heading"]}>
        Your training journey:
      </h2>

      <ul className={styles["how-it-works__body"]}>
        {steps.map((step, index) => (
          <Step key={index} step={{ ...step, number: index + 1 }} />
        ))}
      </ul>
    </section>
  );
};

export default HowItWorks;
