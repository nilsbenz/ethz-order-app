import { User } from "firebase/auth";
import { create } from "zustand";

type AuthStore = {
  user: User | null | undefined;
  setUser: (user: User | null) => void;
};

const useAuthStore = create<AuthStore>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));

export default useAuthStore;
