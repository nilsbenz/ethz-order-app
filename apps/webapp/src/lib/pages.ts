export const Page = {
  Index: "/",
  Register: "/registrieren",
  Login: "/anmelden",
  Profile: "/profil",
  Companies: "/vereine",
  Printers: "/drucker",
  Admin: "/admin",
} as const;
export type Page = (typeof Page)[keyof typeof Page];

export const SubPage = {
  Events: "events",
  Articles: "artikel",
  Tables: "tische",
  Waiters: "personal",
  Join: "beitreten",
} as const;
export type SubPage = (typeof SubPage)[keyof typeof SubPage];
