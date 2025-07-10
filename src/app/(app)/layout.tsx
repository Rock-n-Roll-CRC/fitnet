import type { ReactNode } from "react";

import AppFooter from "@/components/AppFooter/AppFooter";
import { auth } from "@/services/auth";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) return;

  return (
    <>
      {children}
      <AppFooter session={session} />
    </>
  );
};

export default Layout;
