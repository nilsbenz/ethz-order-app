import { doc, getDoc } from "firebase/firestore";
import { customAlphabet } from "nanoid";
import { db } from "./firebase";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet);

export const Collection = {
  Companies: "companies",
  Events: "events",
  Users: "users",
  Orders: "orders",
} as const;
export type Collection = (typeof Collection)[keyof typeof Collection];

export async function generateId(collection: Collection, length: number) {
  let id = nanoid(length);
  while ((await getDoc(doc(db, collection, id))).exists()) {
    id = nanoid(length);
  }
  return id;
}
