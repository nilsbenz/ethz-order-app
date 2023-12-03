import { UserId } from "../auth";
import { RecordId } from "../common";

export type OrderItem = {
  articleId: RecordId;
  amount: number;
  comment: string | null;
};

export type Order = {
  id: RecordId;
  eventId: RecordId;
  createdBy: UserId;
  createdAt: Date;
  table: string;
  items: OrderItem[];
};
