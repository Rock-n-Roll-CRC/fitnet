import NextAuth from "next-auth";

import { authConfig } from "@/services/auth.config";
import { getProfileByUserId } from "./services/apiProfiles";

// export const { auth: middleware } = NextAuth(authConfig);

// export const config = {
//   matcher: [
//     "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|login$|setup$|$).*)",
//   ],
// };

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { auth: session } = req;
  const user = session?.user;

  if (user) {
    const profile = await getProfileByUserId(user.id);

    if (!profile && req.nextUrl.pathname !== "/setup")
      return Response.redirect(new URL("/setup", req.url));
  }

  if (!user) return Response.redirect(new URL("/login", req.url));
});

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|login$|$).*)",
  ],
};
