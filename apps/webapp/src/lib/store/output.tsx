import { Order } from "@order-app/types";
import { create } from "zustand";

type OutputStore = {
  categoryListeners: string[];
  printedCategories: string[];
  currentOrder: Order | null;
  registerCategoryListeners: (add: string[]) => void;
  unregisterCategoryListeners: (remove: string[]) => void;
  setCurrentOrder: (order: Order | null) => void;
  addPrintedCategories: (printed: string[]) => void;
  resetPrintedCategories: () => void;
};

const useOutputStore = create<OutputStore>((set) => ({
  categoryListeners: [],
  printedCategories: [],
  currentOrder: null,
  registerCategoryListeners: (add) =>
    set((prev) => ({
      categoryListeners: Array.from(
        new Set([...prev.categoryListeners, ...add])
      ),
    })),
  unregisterCategoryListeners: (remove) =>
    set((prev) => ({
      categoryListeners: prev.categoryListeners.filter(
        (c) => !remove.includes(c)
      ),
    })),
  setCurrentOrder: (order) => set({ currentOrder: order }),
  addPrintedCategories: (printed) =>
    set((prev) => ({
      printedCategories: Array.from(
        new Set([...prev.printedCategories, ...printed])
      ),
    })),
  resetPrintedCategories: () => set({ printedCategories: [] }),
}));

export default useOutputStore;
