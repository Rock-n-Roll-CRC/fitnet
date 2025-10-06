import type { ReactNode } from "react";

import AppNavigation from "@/components/AppNavigation/AppNavigation";

import { OnlineUsersProvider } from "@/contexts/OnlineUsersContext";

import { auth } from "@/services/auth";
import { getUnreadMessagesCount } from "@/services/apiMessages";
import { getUnreadNotificationsCount } from "@/services/apiNotifications";

import styles from "./layout.module.scss";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth();

  if (!session) return;

  const unreadMessagesCount = await getUnreadMessagesCount(session.user.id);
  const unreadNotificationsCount = await getUnreadNotificationsCount(
    session.user.id,
  );

  return (
    <OnlineUsersProvider userId={session.user.id}>
      <div className={styles.layout}>
        <div className={styles.layout__body}>{children}</div>

        <AppNavigation
          session={session}
          unreadMessagesCount={unreadMessagesCount}
          unreadNotificationsCount={unreadNotificationsCount}
        />
      </div>
    </OnlineUsersProvider>
  );
};

export default Layout;
