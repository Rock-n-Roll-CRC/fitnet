import Testimonial from "@/components/Testimonial/Testimonial";

import ChevronBackSVG from "@/assets/icons/chevron-back-outline.svg";
import ChevronForwardSVG from "@/assets/icons/chevron-forward-outline.svg";

import styles from "./Testimonials.module.scss";

const testimonials = [
  {
    author: { name: "Peter", country: "Fitness coach" },
    description: (
      <>
        Your app is what I needed but didn&apos;t know I wanted — it not only
        doubled my sessions, but made scheduling the thing of the past.
      </>
    ),
    label: "on FitNet's positive effect on productivity",
  },
  {
    author: { name: "Rachael", country: "Yoga instructor" },
    description: (
      <>
        FitNet&apos;s interactive map takes client management to a whole new
        level. Now, I can find my client in less than 3 minutes.
      </>
    ),
    label: "on how our interactive map helps finding clients",
  },
  {
    author: { name: "Davide", country: "Fitness coach" },
    description: (
      <>
        I love the fact that you can get the insights on your revenue, clients,
        etc. Sometimes, you need to take a look at how things are going.
      </>
    ),
    label: "on the importance of statistics",
  },
  {
    author: { name: "Keri", country: "Pilates instructor" },
    description: (
      <>
        Headspace provides me with ... a connection to myself, and a
        disconnection from negative thoughts, feelings, and sensations.
      </>
    ),
    label: "on finding her happy place",
  },
  {
    author: { name: "Davide", country: "France" },
    description: (
      <>
        Lorem ipsum dolor sit amet consectetur adipisicing elit expedita, odit
        dolores itaque assumenda sed nam aperiam repellat sapiente.
      </>
    ),
    label: "on managing his bla bla bla",
  },
];

const Testimonials = () => {
  return (
    <section className={styles.testimonials}>
      <h2 className={styles.testimonials__heading}>
        Don&apos;t just take our word for it
      </h2>

      <ul className={styles.testimonials__list}>
        {testimonials.map((testimonial, index) => (
          <Testimonial key={index} testimonial={testimonial} />
        ))}
      </ul>

      <div className={styles["testimonials__button-container"]}>
        <ChevronBackSVG className={styles.testimonials__button} />
        <ChevronForwardSVG className={styles.testimonials__button} />
      </div>
    </section>
  );
};

export default Testimonials;
