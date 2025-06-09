"use client";

import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

import Logo from "@/components/Logo/Logo";

import GoogleSVG from "@/assets/icons/google.svg";

import {
  signInWithCredentials,
  signInWithGoogle,
  signUpWithCredentials,
} from "@/services/actions";

import styles from "./SignUpForm.module.scss";
import toast from "react-hot-toast";
import { isRedirectError } from "next/dist/client/components/redirect-error";

const SignUpFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must contain less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must contain less than 50 characters"),
  phoneNumber: z
    .string()
    .min(1, "Phone number is required")
    .max(20, "Phone number must contain less than 20 characters")
    .regex(
      /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      "Provided phone number is invalid",
    ),
  email: z
    .email("Provided email is invalid")
    .min(1, "Email is required")
    .max(100, "Email must contain less than 100 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must contain at least 8 characters")
    .max(20, "Password must contain less than 20 characters"),
});

const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: standardSchemaResolver(SignUpFormSchema),
  });

  async function handleSignInWithGoogle() {
    try {
      await signInWithGoogle();
    } catch (error) {
      if (isRedirectError(error)) {
        toast.success("Sign in successful");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to sign in: Something went wrong",
        );
      }
    }
  }

  async function handleSignUpWithCredentials(
    data: z.infer<typeof SignUpFormSchema>,
  ) {
    try {
      const formData = new FormData();

      Object.entries(data).forEach((dataItem) => {
        formData.append(dataItem[0], dataItem[1]);
      });

      await signUpWithCredentials(formData);
      await signInWithCredentials(formData);
    } catch (error) {
      if (isRedirectError(error)) {
        toast.success("Sign up successful");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to sign up: Something went wrong",
        );
      }
    }
  }

  return (
    <article className={styles["signup-form"]}>
      <Logo />

      <div className={styles["signup-form__form"]}>
        <h1 className={styles["signup-form__heading"]}>Sign Up</h1>

        <form
          onSubmit={async (event) => {
            event.preventDefault();

            await signInWithGoogle();
          }}
        >
          <button className={styles["signup-form__google-button"]}>
            <GoogleSVG className={styles["signup-form__button-icon"]} />{" "}
            Continue with Google
          </button>
        </form>

        <span className={styles["signup-form__separator"]}>or</span>

        <form noValidate onSubmit={handleSubmit(handleSignUpWithCredentials)}>
          <div className={styles["signup-form__input-box"]}>
            <label
              htmlFor="firstName"
              className={styles["signup-form__input-label"]}
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              placeholder="Enter your first name"
              {...register("firstName")}
              className={styles["signup-form__input"]}
            />
            <p className={styles["signup-form__error-message"]}>
              {errors.firstName?.message}
            </p>
          </div>

          <div className={styles["signup-form__input-box"]}>
            <label
              htmlFor="lastName"
              className={styles["signup-form__input-label"]}
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              placeholder="Enter your last name"
              {...register("lastName")}
              className={styles["signup-form__input"]}
            />
            <p className={styles["signup-form__error-message"]}>
              {errors.lastName?.message}
            </p>
          </div>

          <div className={styles["signup-form__input-box"]}>
            <label
              htmlFor="email"
              className={styles["signup-form__input-label"]}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              {...register("email")}
              className={styles["signup-form__input"]}
            />
            <p className={styles["signup-form__error-message"]}>
              {errors.email?.message}
            </p>
          </div>

          <div className={styles["signup-form__input-box"]}>
            <label
              htmlFor="phoneNumber"
              className={styles["signup-form__input-label"]}
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              placeholder="Enter your phone number"
              {...register("phoneNumber")}
              className={styles["signup-form__input"]}
            />
            <p className={styles["signup-form__error-message"]}>
              {errors.phoneNumber?.message}
            </p>
          </div>

          <div className={styles["signup-form__input-box"]}>
            <label
              htmlFor="password"
              className={styles["signup-form__input-label"]}
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              {...register("password")}
              className={styles["signup-form__input"]}
            />
            <p className={styles["signup-form__error-message"]}>
              {errors.password?.message}
            </p>
          </div>

          <button className={styles["signup-form__submit-button"]}>
            Create Account
          </button>
        </form>
      </div>
    </article>
  );
};

export default SignUpForm;
