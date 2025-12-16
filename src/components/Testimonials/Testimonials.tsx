"use client";

import { useState } from "react";

import Testimonial from "@/components/Testimonial/Testimonial";

import ChevronBackSVG from "@/assets/icons/chevron-back-outline.svg";
import ChevronForwardSVG from "@/assets/icons/chevron-forward-outline.svg";

import styles from "./Testimonials.module.scss";

const testimonials = [
  {
    author: { name: "Elena", country: "CrossFit coach" },
    description: (
      <>
        The map feature is brilliant. I can see exactly who&apos;s searching in
        my area and reach out immediately. Game changer for my business.
      </>
    ),
    label: "on discovering local clients",
  },
  {
    author: { name: "Tom", country: "Bodybuilder" },
    description: (
      <>
        Finally found a muscle growth coach nearby who gets my goals. The
        filtering saved me hours of searching through generic listings.
      </>
    ),
    label: "on finding specialized coaching",
  },
  {
    author: { name: "Priya", country: "Yoga instructor" },
    description: (
      <>
        Having chat built into the platform means I never miss a potential
        client. They message, I respond in seconds, session booked.
      </>
    ),
    label: "on instant communication",
  },
  {
    author: { name: "James", country: "Cardio enjoyer" },
    description: (
      <>
        Needed someone who understood sustainable weight loss. FitNet&apos;s
        reviews helped me trust my choice before even meeting my coach.
      </>
    ),
    label: "on making informed decisions",
  },
  {
    author: { name: "Maria", country: "Strength coach" },
    description: (
      <>
        My client base tripled in two months. The platform handles discovery and
        communication so I can focus on actual training.
      </>
    ),
    label: "on growing her coaching business",
  },
];

const Testimonials = () => {
  const [selectedTestimonial, setSelectedTestimonial] = useState(
    Math.ceil(testimonials.length / 2) - 1,
  );

  function handleSelectPreviousTestimonial() {
    setSelectedTestimonial(
      (selectedTestimonial) =>
        (selectedTestimonial - 1 + testimonials.length) % testimonials.length,
    );
  }

  function handleSelectNextTestimonial() {
    setSelectedTestimonial(
      (selectedTestimonial) => (selectedTestimonial + 1) % testimonials.length,
    );
  }

  return (
    <section id="testimonials" className={styles.testimonials}>
      <h2 className={styles.testimonials__heading}>
        Don&apos;t just take our word for it
      </h2>

      <div className={styles["testimonials__list-wrapper"]}>
        <ul
          className={styles.testimonials__list}
          style={{
            transform: `translateX(${((Math.ceil(testimonials.length / 2) - 1 - selectedTestimonial) * 26.5).toString()}rem)`,
          }}
        >
          {testimonials.map((testimonial, index) => (
            <Testimonial
              key={index}
              testimonial={testimonial}
              isSelected={selectedTestimonial === index}
            />
          ))}
        </ul>
      </div>

      <div className={styles["testimonials__button-container"]}>
        <button
          onClick={handleSelectPreviousTestimonial}
          className={styles.testimonials__button}
        >
          <ChevronBackSVG className={styles["testimonials__button-icon"]} />
        </button>
        <button
          onClick={handleSelectNextTestimonial}
          className={styles.testimonials__button}
        >
          <ChevronForwardSVG className={styles["testimonials__button-icon"]} />
        </button>
      </div>
    </section>
  );
};

export default Testimonials;

// (Math.ceil(testimonials.length / 2) - 1) - 2 = -50rem
// (Math.ceil(testimonials.length / 2) - 1) - 1 = -25rem
// Math.ceil(testimonials.length / 2) - 1 = 0rem
// (Math.ceil(testimonials.length / 2) - 1) + 1 = 25rem
// (Math.ceil(testimonials.length / 2) - 1) + 2 = 50rem
