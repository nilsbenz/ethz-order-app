import { RecordId } from "../common";

export const ArticleColor = {
  White: "white",
  Red: "red",
  Orange: "orange",
  Yellow: "yellow",
  Green: "green",
  Blue: "blue",
  Purple: "purple",
} as const;
export type ArticleColor = (typeof ArticleColor)[keyof typeof ArticleColor];

export type ArticleCategory = {
  id: string;
  displayName: string;
  color: ArticleColor;
};

export type Article = {
  id: string;
  displayName: string;
  category: string;
  customColor: ArticleColor | null;
};

export type OutputCategoryOutput =
  | {
      type: "screen";
      options: {};
    }
  | {
      type: "print";
      options: {
        printerIp: string;
        printerPort: string;
      };
    };

export type OutputCategory = {
  id: RecordId;
  eventId: RecordId;
  displayName: string;
  output: OutputCategoryOutput;
} & {
  [key in "categories" | "articles"]: {
    include: string[];
    exclude: string[];
  };
};
