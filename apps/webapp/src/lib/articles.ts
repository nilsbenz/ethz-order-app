import { ArticleColor } from "@order-app/types";
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

const colorMapping: { [key in ArticleColor]: string } = {
  [ArticleColor.White]: "bg-white",
  [ArticleColor.Red]: "bg-red-500",
  [ArticleColor.Orange]: "bg-orange-500",
  [ArticleColor.Yellow]: "bg-yellow-500",
  [ArticleColor.Green]: "bg-emerald-500",
  [ArticleColor.Blue]: "bg-sky-500",
  [ArticleColor.Purple]: "bg-purple-500",
} as const;

export function getDisplayColor(color: ArticleColor) {
  return colorMapping[color];
}
