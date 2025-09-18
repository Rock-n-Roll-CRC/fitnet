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
    const res = await signInWithGoogle();

    if (res?.message) {
      toast.error(res.message);
    }
  }

  async function handleSignUpWithCredentials(
    data: z.infer<typeof SignUpFormSchema>,
  ) {
    const formData = new FormData();

    Object.entries(data).forEach((dataItem) => {
      formData.append(dataItem[0], dataItem[1]);
    });

    await toast.promise(
      async () => {
        const resSignUp = await signUpWithCredentials(formData);

        if (resSignUp?.message) {
          toast.error(resSignUp.message);
          return;
        }

        const resSignIn = await signInWithCredentials(formData);

        if (resSignIn?.message) {
          toast.error(resSignIn.message);
          return;
        }
      },
      {
        loading: "Signing up...",
        error: (error) => {
          if (isRedirectError(error)) {
            toast.success("Sign up successfull!");
          }

          return null;
        },
      },
    );
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

        <form
          noValidate
          onSubmit={handleSubmit(handleSignUpWithCredentials)}
          className={styles["signup-form__input-form"]}
        >
          <div className={styles["signup-form__input-list"]}>
            <div
              className={`${styles["signup-form__input-box"] ?? ""} ${(errors.email && styles["signup-form__input-box--error"]) ?? ""}`}
            >
              <div className={styles["signup-form__input-container"]}>
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
              </div>

              <p className={styles["signup-form__error-message"]}>
                {errors.email?.message}
              </p>
            </div>

            <div
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              className={`${styles["signup-form__input-box"] ?? ""} ${(errors.password && styles["signup-form__input-box--error"]) || ""}`}
            >
              <div className={styles["signup-form__input-container"]}>
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
              </div>

              <p className={styles["signup-form__error-message"]}>
                {errors.password?.message}
              </p>
            </div>

            <div
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              className={`${styles["signup-form__input-box"] ?? ""} ${(errors.confirmPassword && styles["signup-form__input-box--error"]) || ""}`}
            >
              <div className={styles["signup-form__input-container"]}>
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
              </div>

              <p className={styles["signup-form__error-message"]}>
                {errors.confirmPassword?.message}
              </p>
            </div>
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
