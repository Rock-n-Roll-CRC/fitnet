import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { getUserByCredentials, getUserByEmail } from "./apiUsers";
import { z } from "zod/v4";
import { authConfig } from "@/services/auth.config";
import { supabase } from "@/services/supabase";

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

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          const validatedCredentials = SignInFormSchema.parse(credentials);

          const user = await getUserByCredentials(validatedCredentials);

          if (!user?.phone_number) return null;

          return {
            id: user.id,
            fullName: user.full_name,
            phoneNumber: user.phone_number,
            email: user.email,
          };
        } catch {
          return null;
        }
      },
    }),
    Google({
      async profile(profile) {
        const existingUser = await getUserByEmail(profile.email);

        if (!existingUser) {
          await supabase
            .from("users")
            .insert([{ full_name: profile.name, email: profile.email }])
            .select();
        }

        const user = await getUserByEmail(profile.email);

        return {
          id: user.id,
          fullName: user.full_name,
          email: user.email,
        };
      },
    }),
  ],
});
