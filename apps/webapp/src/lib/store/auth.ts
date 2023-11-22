import { UserLevel } from "@order-app/types";
import { User } from "firebase/auth";
import { create } from "zustand";

type AuthStore = {
  user: User | null | undefined;
  userLevel: UserLevel | undefined;
  setUser: (user: User | null) => void;
  setUserLevel: (userLevel: UserLevel | undefined) => void;
};

const useAuthStore = create<AuthStore>((set) => ({
  user: undefined,
  userLevel: undefined,
  setUser: (user) => set({ user }),
  setUserLevel: (userLevel) => set({ userLevel }),
}));

export default useAuthStore;
