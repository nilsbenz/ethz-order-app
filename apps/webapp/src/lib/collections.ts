export const Collection = {
  Users: "users",
} as const;
export type Collection = (typeof Collection)[keyof typeof Collection];
