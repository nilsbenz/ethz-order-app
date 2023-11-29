import { AppUser, Event } from "@order-app/types";
import { create } from "zustand";

type EventStore = {
  event: Event | undefined;
  waiters: AppUser[];
  setEvent: (event: Event | undefined) => void;
  setWaiters: (waiters: AppUser[]) => void;
};

const useEventStore = create<EventStore>((set) => ({
  event: undefined,
  waiters: [],
  setEvent: (event) => set({ event }),
  setWaiters: (waiters) => set({ waiters }),
}));

export default useEventStore;
