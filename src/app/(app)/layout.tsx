import type { ReactNode } from "react";

import AppFooter from "@/components/AppFooter/AppFooter";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      {children}
      <AppFooter />
    </>
  );
};

export default Layout;
