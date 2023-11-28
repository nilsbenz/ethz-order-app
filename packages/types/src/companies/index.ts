import { Article, ArticleCategory, TableConfig } from "..";
import { UserId } from "../auth";
import { RecordId } from "../common";

export type Waiter = {
  userId: UserId;
  enabled: boolean;
  checkedInAt: Date;
  disableAt: Date;
};

export type Event = {
  id: RecordId;
  companyId: RecordId;
  displayName: string;
  waiters: Waiter[];
  articleCategories: ArticleCategory[];
  articles: Article[];
  tables: TableConfig;
  archived: boolean;
};

export type Company = {
  id: RecordId;
  displayName: string;
  admins: UserId[];
  archived: boolean;
};
