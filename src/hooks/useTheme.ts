import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const THEME_COLORS: Record<Theme, string> = { light: "#fdfdfc", dark: "#181818" };

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLORS[theme]);
  }, [theme]);

  function toggle() {
    setTheme((t) => {
      const next: Theme = t === "light" ? "dark" : "light";
      try {
        localStorage.setItem("zentex-theme", next);
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }

  return { theme, toggle };
}
