export const Page = {
  Index: "/",
  Profile: "/profil",
} as const;
export type Page = (typeof Page)[keyof typeof Page];
