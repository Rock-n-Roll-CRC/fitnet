import type { ReactNode } from "react";

import { Montserrat } from "next/font/google";

import { ThemeProvider } from "@/contexts/ThemeContext";

import "@/styles/main.scss";

export const metadata = {
  title: {
    default: "FitNet - Connect, Reserve, Work Out!",
    template: "%s / FitNet",
  },
};

const montserrat = Montserrat({ display: "swap", subsets: ["latin"] });

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
