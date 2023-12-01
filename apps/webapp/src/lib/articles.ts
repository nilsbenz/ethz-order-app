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
  [ArticleColor.White]: "bg-white text-black",
  [ArticleColor.Red]: "bg-rose-500 text-black",
  [ArticleColor.Orange]: "bg-orange-500 text-black",
  [ArticleColor.Yellow]: "bg-amber-400 text-black",
  [ArticleColor.Green]: "bg-emerald-500 text-white",
  [ArticleColor.Blue]: "bg-sky-600 text-white",
  [ArticleColor.Purple]: "bg-purple-500 text-white",
} as const;

export function getDisplayColor(color: ArticleColor) {
  return colorMapping[color];
}

export const colorOptions: { [key in ArticleColor]: string } = {
  [ArticleColor.White]: "Weiss",
  [ArticleColor.Red]: "Rot",
  [ArticleColor.Orange]: "Orange",
  [ArticleColor.Yellow]: "Gelb",
  [ArticleColor.Green]: "Grün",
  [ArticleColor.Blue]: "Blau",
  [ArticleColor.Purple]: "Violett",
} as const;
