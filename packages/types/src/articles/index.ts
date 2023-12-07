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
  enabled: boolean;
  archived: boolean;
  output: string;
};

export type Article = {
  id: string;
  displayName: string;
  category: string;
  price: number;
  customColor: ArticleColor | null;
  customOutput: string | null;
  enabled: boolean;
  archived: boolean;
};

export type OutputCategory = {
  id: string;
  displayName: string;
};
