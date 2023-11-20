import { RecordId } from "../common";

export type ArticleCategory = {
  id: RecordId;
  eventId: RecordId;
  displayName: string;
  color: string;
};

export type Article = {
  id: RecordId;
  eventId: RecordId;
  displayName: string;
  category: string;
  customColor: string | null;
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
