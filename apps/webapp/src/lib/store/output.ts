import { Order } from "@order-app/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type DisplayOutput = {
  id: string;
};

type PrinterOutput = {
  id: string;
  printer: string;
  enabled: boolean;
  outputCategories: string[];
  currentOrder: Order;
  history: Order[];
};

type OutputStore = {
  printers: PrinterOutput[];
  displays: DisplayOutput[];
  addPrinter: (printer: PrinterOutput) => void;
  updatePrinter: (
    output: Pick<PrinterOutput, "id"> &
      Partial<Pick<PrinterOutput, "enabled" | "outputCategories" | "printer">>
  ) => void;
  removePrinter: (id: PrinterOutput["id"]) => void;
};

const useOutputStore = create<OutputStore>()(
  persist(
    (set) => ({
      printers: [],
      displays: [],
      addPrinter: (printer) =>
        set((state) => ({
          printers: [...state.printers, printer],
        })),
      updatePrinter: (printer) =>
        set((state) => ({
          printers: state.printers.map((p) =>
            p.id === printer.id ? { ...p, ...printer } : p
          ),
        })),
      removePrinter: (id) =>
        set((state) => ({
          printers: state.printers.filter((p) => p.id !== id),
        })),
    }),
    {
      name: "output-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useOutputStore;
