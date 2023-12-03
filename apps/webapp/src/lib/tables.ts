import { TableLabelType } from "@order-app/types";

export function getTableLabel(count: number, labelType: TableLabelType) {
  if (labelType === TableLabelType.Alphabetic) {
    return String.fromCharCode(65 + count);
  } else {
    return String(count + 1).padStart(2, "0");
  }
}
