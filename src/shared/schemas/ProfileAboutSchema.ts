import { z } from "zod/v4";

import { calculateAge } from "@/utilities/helpers";

const ProfileAboutSchemaBase = z.object({
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

const ProfileAboutSchemaClient = ProfileAboutSchemaBase.extend({
  role: z.literal("client"),
});

const ProfileAboutSchemaCoach = ProfileAboutSchemaBase.extend({
  role: z.literal("coach"),

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

export const ProfileAboutSchema = z.discriminatedUnion("role", [
  ProfileAboutSchemaClient,
  ProfileAboutSchemaCoach,
]);

export type ProfileAboutFieldValues = z.infer<typeof ProfileAboutSchema>;
export type ProfileAboutCoachFieldValues = z.infer<
  typeof ProfileAboutSchemaCoach
>;
