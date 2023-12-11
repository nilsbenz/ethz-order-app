export const Page = {
  Index: "/",
  Register: "/registrieren",
  Login: "/anmelden",
  Profile: "/profil",
  Companies: "/vereine",
  Admin: "/admin",
  Reset: "/reset",
} as const;
export type Page = (typeof Page)[keyof typeof Page];

export const SubPage = {
  Events: "events",
  Orders: "bestellungen",
  Articles: "artikel",
  Tables: "tische",
  Waiters: "personal",
  Visualizations: "auswertungen",
  Join: "beitreten",
  Order: "bestellen",
} as const;
export type SubPage = (typeof SubPage)[keyof typeof SubPage];
