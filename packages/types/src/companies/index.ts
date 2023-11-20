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
};

export type Company = {
  id: RecordId;
  displayName: string;
  admins: UserId[];
};
