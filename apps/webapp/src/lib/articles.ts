import { customAlphabet } from "nanoid";

const alphabet =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const nanoid = customAlphabet(alphabet);

export function generateId(existing: { id: string }[]) {
  let id = nanoid(4);
  while (existing.find((a) => a.id === id)) {
    id = nanoid(4);
  }
  return id;
}
