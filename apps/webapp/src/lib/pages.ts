export const Page = {
  Index: "/",
  Profile: "/profil",
  Events: "/events",
  Articles: "/events/artikel",
  Companies: "/companies",
} as const;
export type Page = (typeof Page)[keyof typeof Page];
