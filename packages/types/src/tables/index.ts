import { RecordId } from "../common";

export type Table = {
  id: RecordId;
  eventId: RecordId;
  displayName: string;
  customColor: string | null;
};

export type TableConfig = {
  eventId: RecordId;
  rowCount: number;
  colCount: number;
  tables: (Table | null)[][];
};
