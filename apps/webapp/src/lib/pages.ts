export const Page = {
  Index: "/",
  Register: "/registrieren",
  Login: "/anmelden",
  Profile: "/profil",
  Events: "/events",
  Companies: "/companies",
  Printers: "/drucker",
  Admin: "/admin",
} as const;
export type Page = (typeof Page)[keyof typeof Page];

export const SubPage = {
  Articles: "artikel",
} as const;
export type SubPage = (typeof SubPage)[keyof typeof SubPage];
