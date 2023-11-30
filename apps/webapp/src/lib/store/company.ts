import { AppUser, Company, Event } from "@order-app/types";
import { create } from "zustand";

type CompanyStore = {
  company: Company | undefined;
  events: Event[] | undefined;
  admins: AppUser[] | undefined;
  setCompany: (company: Company | undefined) => void;
  setEvents: (events: Event[]) => void;
  setAdmins: (admins: AppUser[]) => void;
};

const useCompanyStore = create<CompanyStore>((set) => ({
  company: undefined,
  events: undefined,
  admins: undefined,
  setCompany: (company) => set({ company }),
  setEvents: (events) => set({ events }),
  setAdmins: (admins) => set({ admins }),
}));

export default useCompanyStore;
