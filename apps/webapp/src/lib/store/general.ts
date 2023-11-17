import { create } from "zustand";

const Theme = {
  Light: "light",
  Dark: "dark",
} as const;
export type Theme = (typeof Theme)[keyof typeof Theme];

type GeneralStore = {
  theme: Theme;
  toggleTheme: () => void;
};

const useGeneralStore = create<GeneralStore>((set, get) => ({
  theme:
    localStorage.getItem("theme") === Theme.Light ? Theme.Light : Theme.Dark,
  toggleTheme: () => {
    const next = get().theme === Theme.Light ? Theme.Dark : Theme.Light;
    localStorage.setItem("theme", next);
    set({ theme: next });
  },
}));

export default useGeneralStore;
