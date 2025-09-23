import type { ReactNode } from "react";

import { Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";

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
        <ThemeProvider>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;

// Realtime  counter for unread messages/notifications
// Add modal window for selected profiles on the map
// Fix clear button for messages
