import NextAuth from "next-auth";

import { authConfig } from "@/services/auth.config";

export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|login$|$).*)",
  ],
};
