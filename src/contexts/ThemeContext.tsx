"use client";

import type { ReactNode } from "react";

import { createContext, useEffect, useState } from "react";

type ColorTheme = "light" | "dark";

const initialValue: {
  colorTheme: ColorTheme;
  handleToggleColorTheme: () => void;
} = {
  colorTheme: "light",
  handleToggleColorTheme: () => {
    throw new Error('The "Theme Context" was used outside of its provider.');
  },
};

const ThemeContext = createContext(initialValue);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(
    initialValue.colorTheme,
  );

  function handleToggleColorTheme() {
    setColorTheme((colorTheme) => (colorTheme === "light" ? "dark" : "light"));
  }

  useEffect(() => {
    const storagedColorTheme = localStorage.getItem(
      "color-theme",
    ) as ColorTheme | null;

    if (storagedColorTheme) setColorTheme(storagedColorTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("color-theme", colorTheme);
  }, [colorTheme]);

  return (
    <ThemeContext.Provider value={{ colorTheme, handleToggleColorTheme }}>
      <div
        className={`theme--${colorTheme}`}
        style={{ display: "flex", flexDirection: "column", flex: 1 }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
