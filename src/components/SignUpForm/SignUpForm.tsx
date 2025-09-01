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
import Link from "next/link";

const SignUpFormSchema = z
  .object({
    email: z
      .email("Provided email is invalid")
      .min(1, "Email is required")
      .max(100, "Email must contain less than 100 characters"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must contain at least 8 characters")
      .max(20, "Password must contain less than 20 characters"),
    confirmPassword: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password must contain at least 8 characters")
      .max(20, "Password must contain less than 20 characters"),
  })
  .refine((d) => d.confirmPassword === d.password, {
    path: ["confirmPassword"],
    error: "Passwords must match!",
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
          onSubmit={(event) => {
            event.preventDefault();

            void handleSignInWithGoogle();
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

          <div className={styles["signup-form__input-box"]}>
            <label
              htmlFor="password"
              className={styles["signup-form__input-label"]}
            >
              Password Confirmation
            </label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              className={styles["signup-form__input"]}
            />
            <p className={styles["signup-form__error-message"]}>
              {errors.confirmPassword?.message}
            </p>
          </div>

          <button className={styles["signup-form__submit-button"]}>
            Create Account
          </button>
        </form>
      </div>

      <p>
        Already have an account? <Link href="/login?type=sign-in">Sign In</Link>
      </p>
    </article>
  );
};

export default SignUpForm;
