import { AppUser, Event } from "@order-app/types";
import { create } from "zustand";

type EventStore = {
  event: Event | undefined;
  waiters: AppUser[] | undefined;
  setEvent: (event: Event | undefined) => void;
  setWaiters: (waiters: AppUser[]) => void;
};

const useEventStore = create<EventStore>((set) => ({
  event: undefined,
  waiters: undefined,
  setEvent: (event) => set({ event }),
  setWaiters: (waiters) => set({ waiters }),
}));

export default useEventStore;
