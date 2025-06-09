import type { DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    fullName: string;
    phoneNumber?: string;
    email: string;
  }

  interface Session {
    user: {
      id: string;
      fullName: string;
      phoneNumber?: string;
      email: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: {
      id: string;
      fullName: string;
      phoneNumber?: string;
      email: string;
    };
  }
}
