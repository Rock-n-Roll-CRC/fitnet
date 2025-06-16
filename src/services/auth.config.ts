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
    jwt({ token, account, user, trigger }) {
      if (trigger === "signIn")
        return {
          ...token,
          user: { ...user, id: account?.providerAccountId ?? user.id },
        };

      return token;
    },
    session({ session, token }) {
      return { ...session, user: token.user };
    },
  },
  providers: [],
} satisfies NextAuthConfig;
