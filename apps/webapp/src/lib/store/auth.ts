import { AppUser } from "@order-app/types";
import { User } from "firebase/auth";
import { create } from "zustand";

type AuthStore = {
  user: User | null | undefined;
  userData: AppUser | undefined;
  setUser: (user: User | null) => void;
  setUserData: (userData: AppUser | undefined) => void;
};

const useAuthStore = create<AuthStore>((set) => ({
  user: undefined,
  userData: undefined,
  setUser: (user) => set({ user }),
  setUserData: (userData) => set({ userData }),
}));

export default useAuthStore;
