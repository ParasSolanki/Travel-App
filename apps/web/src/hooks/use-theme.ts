import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

export const Theme = {
  LIGHT: "Light",
  DARK: "Dark",
  SYSTEM: "System",
} as const;

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<(typeof Theme)[keyof typeof Theme]>(
    "theme",
    "System",
  );

  useEffect(() => {
    const handleChangeTheme = (isDark: boolean) => {
      document.documentElement.classList.add("no-transitions");
      document.documentElement.classList.remove("light", "dark");

      document.documentElement.classList.add(isDark ? "dark" : "light");

      const timeout = setTimeout(() => {
        document.documentElement.classList.remove("no-transitions");
        clearTimeout(timeout);
      });
    };

    const handleMediaChange = (ev: MediaQueryListEvent) => {
      handleChangeTheme(ev.matches);
    };

    let match: MediaQueryList | undefined = undefined;

    if (theme === "System") {
      match = window.matchMedia("(prefers-color-scheme: dark)");
      handleChangeTheme(match.matches);
      match.addEventListener("change", handleMediaChange);
    } else handleChangeTheme(theme === "Dark" ? true : false);

    return () => {
      if (match) match.removeEventListener("change", handleMediaChange);
    };
  }, [theme]);

  return { theme, setTheme };
}
