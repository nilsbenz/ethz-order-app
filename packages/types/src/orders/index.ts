import { UserId } from "../auth";
import { RecordId } from "../common";

export type OrderItem = {
  id: RecordId;
  displayName: string;
  amount: number;
  price: number;
  comment: string | null;
};

export type Order = {
  id: RecordId;
  eventId: RecordId;
  createdBy: UserId;
  createdAt: Date;
  items: OrderItem[];
};
