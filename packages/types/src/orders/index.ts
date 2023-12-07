import { UserId } from "../auth";
import { RecordId } from "../common";

export const OrderStatus = {
  Draft: "draft",
  Confirmed: "confirmed",
  Done: "done",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export type OrderItem = {
  articleId: RecordId;
  amount: number;
  comment: string | null;
};

export type Order = {
  id: RecordId;
  status: OrderStatus;
  eventId: RecordId;
  createdBy: UserId;
  createdAt: Date;
  table: string;
  items: OrderItem[];
  outputs: string[];
};
