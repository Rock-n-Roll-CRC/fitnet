"use client";

import type { Session } from "next-auth";

import { useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import { z } from "zod/v4";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

import Select from "@/components/Select/Select";
import MultiSelect from "@/components/MultiSelect/MultiSelect";
import InputText from "@/components/InputText/InputText";
import InputTel from "@/components/InputTel/InputTel";
import InputCity from "@/components/InputCity/InputCity";
import InputDate from "@/components/InputDate/InputDate";
import InputHourlyRate from "@/components/InputHourlyRate/InputHourlyRate";

import { calculateAge } from "@/utilities/helpers";

import CloudUploadOutlineSVG from "@/assets/icons/cloud-upload-outline.svg";

import styles from "./ProfileSetup.module.scss";
import { createProfile, uploadAvatar } from "@/services/actions";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ProfileFormSchemaClient = z.object({
  fullName: z
    .string()
    .min(1, "Full Name is required")
    .min(2, "Full Name must contain at least 2 characters")
    .max(100, "Full Name must contain less than 100 characters")
    .regex(/^[\p{L}.'’\- ]+$/u, "Full name contains invalid characters")
    .refine(
      (s) => s.trim().split(/\s+/).length >= 2,
      "Full name must include at least first and last name",
    ),

  phoneNumber: z
    .string()
    .regex(
      /^\+?[1-9]\d{6,14}$/,
      "Phone number must include leading +, and have the length of 7-15",
    ),

  city: z
    .string()
    .min(1, "City is required")
    .min(2, "City must contain at least 2 characters")
    .max(100, "City must contain less than 100 characters")
    .regex(/^[\p{L}0-9.'’\-\s]{2,100}$/u, "City contains invalid characters"),

  birthdate: z.preprocess(
    (val) => {
      if (typeof val === "string" || val instanceof Date) return new Date(val);
      return val;
    },
    z
      .date("Birthdate is required")
      .max(new Date(), "Birthdate must be in the past")
      .refine((d) => {
        const age = calculateAge(d);
        return age >= 13 && age <= 120;
      }, "Age must be between 13 and 120"),
  ),
});

const ProfileFormSchemaCoach = z.object({
  ...ProfileFormSchemaClient.shape,

  hourlyRate: z.preprocess(
    (val) => {
      if (typeof val === "string") return +val;
      if (typeof val === "undefined") return 0;
      return val;
    },
    z
      .number()
      .min(1, "Hourly rate is required")
      .max(1000000, "Hourly rate must be less than 1000000"),
  ),
});

export default function ProfileSetup({ session }: { session: Session }) {
  const router = useRouter();
  const [profile, setProfile] = useState<{
    user_id: string;
    role: "client" | "coach";
    avatar_url: string;
    full_name: string;
    phone_number: string;
    gender: "male" | "female";
    city: string;
    birthdate: string;
    hourly_rate: number;
    hourly_rate_currency: string;
    fitness_goal: "muscle growth" | "weight loss" | "yoga";
    expertise: ("muscle growth" | "weight loss" | "yoga")[];
    isSearching: boolean;
    location: null;
  }>({
    user_id: session.user.id,
    role: "client",
    avatar_url: "https://www.gravatar.com/avatar/?d=mp&f=y&s=200",
    full_name: "",
    phone_number: "",
    gender: "male",
    city: "",
    birthdate: "",
    hourly_rate: 0,
    hourly_rate_currency: "$",
    fitness_goal: "muscle growth",
    expertise: ["muscle growth", "weight loss", "yoga"],
    isSearching: false,
    location: null,
  });

  const schema =
    profile.role === "client"
      ? ProfileFormSchemaClient
      : ProfileFormSchemaCoach;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: standardSchemaResolver(schema),
  });

  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFinishSetup() {
    const action = createProfile(profile);

    await toast.promise(action, {
      loading: "Creating your profile...",
      error: (error) => {
        return error instanceof Error
          ? error.message
          : "Failed to create profile: Something went wrong";
      },
    });

    router.push("/search");
  }

  async function handleUploadFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    const url = await uploadAvatar(file, session.user.id);

    setProfile((profile) => ({ ...profile, avatar_url: url }));
  }

  return (
    <div className={styles["profile-setup"]}>
      <div className={styles["profile-setup__top-container"]}>
        <div className={styles["profile-setup__image-wrapper"]}>
          <Image
            src={profile.avatar_url}
            alt={profile.full_name}
            fill
            className={styles["profile-setup__image"]}
          />
          <input
            type="file"
            name="avatar-upload"
            id="avatar-upload"
            ref={inputRef}
            accept="image/*"
            onChange={(event) => {
              void handleUploadFile(event);
            }}
            hidden
          />
          <button
            onClick={() => {
              inputRef.current?.click();
            }}
            className={styles["profile-setup__image-upload-button"]}
          >
            <CloudUploadOutlineSVG
              className={styles["profile-setup__image-upload-icon"]}
            />
          </button>
        </div>

        <div className={styles["profile-setup__text-content"]}>
          <h1 className={styles["profile-setup__heading"]}>
            Setup Your Profile
          </h1>

          <p className={styles["profile-setup__description"]}>
            Get a more personalized experience
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(handleFinishSetup)}
        className={styles["profile-setup__bottom-container"]}
      >
        <div className={styles["profile-setup__input-container"]}>
          <Select
            fill
            label="Role"
            options={["client", "coach"]}
            value={profile.role}
            onChange={(role) => {
              setProfile((editedProfile) => ({
                ...editedProfile,
                role,
              }));
            }}
          />

          <InputText
            fill
            label="Full Name"
            register={register("fullName")}
            error={errors.fullName}
            value={profile.full_name}
            onChange={(val) => {
              setProfile((editedProfile) => ({
                ...editedProfile,
                full_name: val,
              }));
            }}
          />

          <InputTel
            fill
            label={true}
            register={register("phoneNumber")}
            error={errors.phoneNumber}
            value={profile.phone_number}
            onChange={(val) => {
              setProfile((editedProfile) => ({
                ...editedProfile,
                phone_number: val,
              }));
            }}
          />

          <InputCity
            fill
            label={true}
            register={register("city")}
            error={errors.city}
            value={profile.city}
            onChange={(val) => {
              setProfile((editedProfile) => ({
                ...editedProfile,
                city: val,
              }));
            }}
          />

          <Select
            fill
            label="Gender"
            options={["male", "female"]}
            value={profile.gender}
            onChange={(gender) => {
              setProfile((editedProfile) => ({
                ...editedProfile,
                gender,
              }));
            }}
          />

          <InputDate
            fill
            label="Birthdate"
            register={register("birthdate")}
            error={errors.birthdate}
            value={profile.birthdate}
            onChange={(date) => {
              setProfile((editedProfile) => ({
                ...editedProfile,
                birthdate: date,
              }));
            }}
          />

          {profile.role === "client" ? (
            <Select
              fill
              label="Fitness Goal"
              options={["muscle growth", "weight loss", "yoga"]}
              value={profile.fitness_goal}
              onChange={(fitnessGoal) => {
                setProfile((editedProfile) => ({
                  ...editedProfile,
                  fitness_goal: fitnessGoal,
                }));
              }}
            />
          ) : (
            <>
              <MultiSelect
                fill
                label="Expertise"
                options={["muscle growth", "weight loss", "yoga"]}
                value={profile.expertise}
                onChange={(val) => {
                  setProfile((editedProfile) => ({
                    ...editedProfile,
                    expertise: val.length > 0 ? val : editedProfile.expertise,
                  }));
                }}
              />

              <InputHourlyRate
                fill
                label={true}
                register={register("hourlyRate")}
                error={errors.hourlyRate}
                rate={profile.hourly_rate}
                currency={profile.hourly_rate_currency}
                onChange={(rate: number, currency: string) => {
                  setProfile((editedProfile) => ({
                    ...editedProfile,
                    hourly_rate: rate,
                    hourly_rate_currency: currency,
                  }));
                }}
              />
            </>
          )}
        </div>

        <button className={styles["profile-setup__button"]}>
          Done & Dusted
        </button>
      </form>
    </div>
  );
}
