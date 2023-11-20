import { useEffect, useLayoutEffect } from "react";
import useGeneralStore from "../store/general";

export default function useTheme() {
  const [theme, setTheme] = useGeneralStore((state) => [
    state.theme,
    state.setTheme,
  ]);

  useLayoutEffect(() => {
    const inactive = theme === "light" ? "dark" : "light";
    document.body.classList.add(theme);
    document.body.classList.remove(inactive);
  }, [theme]);

  useEffect(() => {
    const handleThemePreferenceChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? "dark" : "light");
    };
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleThemePreferenceChange);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handleThemePreferenceChange);
    };
  }, []);
}
