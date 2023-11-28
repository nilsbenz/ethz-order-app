export type Table = {
  id: string;
  displayName: string;
  customColor: string | null;
};

export type TableConfig = {
  rowCount: number;
  colCount: number;
  tables: {
    [row: number]: {
      [col: number]: Table;
    };
  };
};
