export const TableLabelType = {
  Alphabetic: "alphabetic",
  Numeric: "numeric",
} as const;
export type TableLabelType =
  (typeof TableLabelType)[keyof typeof TableLabelType];

export type TableConfig = {
  rowCount: number;
  colCount: number;
  rowLabels: TableLabelType;
  colLabels: TableLabelType;
  tables: {
    row: number;
    col: number;
  }[];
};
