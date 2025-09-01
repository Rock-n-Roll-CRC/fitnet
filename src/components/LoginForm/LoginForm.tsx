"use client";

import Link from "next/link";

import Logo from "@/components/Logo/Logo";

import GoogleSVG from "@/assets/icons/google.svg";

import { signInWithCredentials, signInWithGoogle } from "@/services/actions";

import styles from "./LoginForm.module.scss";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import toast from "react-hot-toast";
import { isRedirectError } from "next/dist/client/components/redirect-error";

const SignInFormSchema = z.object({
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

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof SignInFormSchema>>({
    resolver: standardSchemaResolver(SignInFormSchema),
  });

  async function handleSignInWithGoogle() {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to sign in: Something went wrong",
      );
    }
  }

  async function handleSignInWithCredentials(
    data: z.infer<typeof SignInFormSchema>,
  ) {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([name, value]) => {
        formData.append(name, value);
      });

      await signInWithCredentials(formData);
    } catch (error) {
      if (isRedirectError(error)) {
        toast.success("Log in successful");
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to sign in: Something went wrong",
        );
      }
    }
  }

  return (
    <article className={styles["login-form"]}>
      <Logo />

      <div className={styles["login-form__form"]}>
        <h1 className={styles["login-form__heading"]}>Login</h1>

        <form
          onSubmit={async (event) => {
            event.preventDefault();

            await handleSignInWithGoogle();
          }}
        >
          <button className={styles["login-form__google-button"]}>
            <GoogleSVG className={styles["login-form__button-icon"]} /> Sign in
            with Google
          </button>
        </form>

        <span className={styles["login-form__separator"]}>or</span>

        <form
          noValidate
          onSubmit={handleSubmit(handleSignInWithCredentials)}
          className={styles["login-form__input-form"]}
        >
          <div className={styles["login-form__input-list"]}>
            <div
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              className={`${styles["login-form__input-box"] ?? ""} ${(errors.email && styles["login-form__input-box--error"]) || ""}`}
            >
              <div className={styles["login-form__input-container"]}>
                <label
                  htmlFor="email"
                  className={styles["login-form__input-label"]}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  placeholder="Enter your email"
                  {...register("email")}
                  className={styles["login-form__input"]}
                />
              </div>
              <p className={styles["login-form__error-message"]}>
                {errors.email?.message}
              </p>
            </div>

            <div
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              className={`${styles["login-form__input-box"] ?? ""} ${(errors.password && styles["login-form__input-box--error"]) || ""}`}
            >
              <div className={styles["login-form__input-container"]}>
                <label
                  htmlFor="password"
                  className={styles["login-form__input-label"]}
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  placeholder="Enter your password"
                  {...register("password")}
                  className={styles["login-form__input"]}
                />
              </div>
              <p className={styles["login-form__error-message"]}>
                {errors.password?.message}
              </p>
            </div>
          </div>

          <button className={styles["login-form__submit-button"]}>
            Log In
          </button>
        </form>
      </div>

      <p>
        Don&apos;t have an account?{" "}
        <Link href="/login?type=sign-up">Sign Up</Link>
      </p>
    </article>
  );
};

export default LoginForm;
