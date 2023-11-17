import { create } from "zustand";

const Theme = {
  Light: "light",
  Dark: "dark",
} as const;
export type Theme = (typeof Theme)[keyof typeof Theme];

type GeneralStore = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

function getTheme(): Theme {
  const stored = localStorage.getItem("theme");
  if (!stored) {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
      ? Theme.Dark
      : Theme.Light;
  }
  return stored as Theme;
}

const useGeneralStore = create<GeneralStore>((set, get) => ({
  theme: getTheme(),
  toggleTheme: () => {
    const next = get().theme === Theme.Light ? Theme.Dark : Theme.Light;
    localStorage.setItem("theme", next);
    set({ theme: next });
  },
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    set({ theme });
  },
}));

export default useGeneralStore;
