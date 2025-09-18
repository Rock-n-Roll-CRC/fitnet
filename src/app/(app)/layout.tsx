import type { ReactNode } from "react";

import AppFooter from "@/components/AppFooter/AppFooter";

import { OnlineUsersProvider } from "@/contexts/OnlineUsersContext";

import { auth } from "@/services/auth";
import { getUnreadMessagesCount } from "@/services/apiMessages";
import { getUnreadNotificationsCount } from "@/services/apiNotifications";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) return;

  const unreadMessagesCount = await getUnreadMessagesCount(session.user.id);
  const unreadNotificationsCount = await getUnreadNotificationsCount(
    session.user.id,
  );

  return (
    <OnlineUsersProvider userId={session.user.id}>
      {children}
      <AppFooter
        session={session}
        unreadMessagesCount={unreadMessagesCount}
        unreadNotificationsCount={unreadNotificationsCount}
      />
    </OnlineUsersProvider>
  );
};

export default Layout;
