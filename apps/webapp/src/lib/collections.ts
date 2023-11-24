export const Collection = {
  Users: "users",
  Companies: "companies",
} as const;
export type Collection = (typeof Collection)[keyof typeof Collection];
