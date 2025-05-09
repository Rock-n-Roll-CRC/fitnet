import Step from "@/components/Step/Step";

import MyLocationSVG from "@/assets/illustrations/my-location.svg";
import PhoneCallSVG from "@/assets/illustrations/phone-call.svg";
import PersonalTrainingSVG from "@/assets/illustrations/personal-training.svg";

import styles from "./HowItWorks.module.scss";

const steps = [
  {
    heading: "Find your client",
    description: (
      <>
        Explore our interactive map to pick the client that fits you best by
        weighing their proposed price, fitness goal and workout place.
      </>
    ),
    illustration: MyLocationSVG,
  },
  {
    heading: "Contact for details",
    description: (
      <>
        Use the provided client&apos;s phone number to iron out the details and
        ensure that both sides are ready to meet.
      </>
    ),
    illustration: PhoneCallSVG,
  },
  {
    heading: "Workout together",
    description: (
      <>
        Meet your client at the discussed place and make sure to do your best to
        help your client achieve their goal!
      </>
    ),
    illustration: { value: PersonalTrainingSVG, isHorizontal: true },
  },
];

const HowItWorks = () => {
  return (
    <section className={styles["how-it-works"]}>
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
