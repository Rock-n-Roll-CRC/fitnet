import type { ReactNode } from "react";

import AppFooter from "@/components/AppFooter/AppFooter";

import { OnlineUsersProvider } from "@/contexts/OnlineUsersContext";

import { auth } from "@/services/auth";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) return;

  return (
    <OnlineUsersProvider userId={session.user.id}>
      {children}
      <AppFooter session={session} />
    </OnlineUsersProvider>
  );
};

export default Layout;

// 1) Messages scroll window
// 2) Save changes optimistic
// 3) Map positioning
