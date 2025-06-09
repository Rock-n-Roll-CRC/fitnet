import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth }) {
      return !!auth;
    },
    jwt({ token, user, trigger }) {
      if (trigger === "signIn") return { ...token, user };

      return token;
    },
    session({ session, token }) {
      return { ...session, user: token.user };
    },
  },
  providers: [],
} satisfies NextAuthConfig;
