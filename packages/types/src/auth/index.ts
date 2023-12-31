import { RecordId } from "../common";

export type UserId = string;

export const UserLevel = {
  SuperAdmin: 9,
  Admin: 5,
  Waiter: 3,
  User: 1,
} as const;
export type UserLevel = (typeof UserLevel)[keyof typeof UserLevel];

export type Claims = {
  superadmin?: boolean;
  admin?: RecordId;
  waiter?: RecordId;
  validUntil?: number;
};

export type AppUser = {
  id: UserId;
  displayName: string;
  searchName: string;
  photoUrl: string;
  level: UserLevel;
  company: string | null;
  event: string | null;
  validUntil: number | null;
};
