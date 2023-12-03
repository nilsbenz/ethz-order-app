import { OrderItem } from "@order-app/types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type OrderStorageBase = {
  eventId: string;
  table: string;
  items: (OrderItem & { paid: number })[];
};

type OrderStoreAttributes =
  | { stage: "initial" }
  | ({
      stage: "draft" | "payment" | "success";
    } & OrderStorageBase);

type OrderStore = OrderStoreAttributes & {
  createNewOrder: (eventId: string, table: string) => void;
  cancelOrder: () => void;
  changeTable: (table: string) => void;
  updateItems: (item: OrderItem) => void;
  handleDraftApproved: () => void;
  updatePayments: (artileId: string, amount: number) => void;
  nextPayment: () => void;
};

const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      stage: "initial",
      createNewOrder: (eventId, table) =>
        set((state) =>
          state.stage === "initial"
            ? { stage: "draft", eventId, table, items: [] }
            : {}
        ),
      cancelOrder: () => set({ stage: "initial" }),
      changeTable: (table) =>
        set((state) => (state.stage === "draft" ? { table } : {})),
      updateItems: (item) =>
        set((state) =>
          state.stage === "draft"
            ? state.items.some((i) => i.articleId === item.articleId)
              ? {
                  items: state.items.map((i) =>
                    i.articleId === item.articleId ? { ...i, ...item } : i
                  ),
                }
              : { items: [...state.items, { ...item, paid: 0 }] }
            : {}
        ),
      handleDraftApproved: () =>
        set((state) => (state.stage === "draft" ? { stage: "payment" } : {})),
      updatePayments: (articleId, paid) =>
        set((state) => {
          if (state.stage !== "payment") {
            return {};
          }
          const newState = {
            stage: "payment",
            items: state.items.map((i) =>
              i.articleId === articleId ? { ...i, paid } : i
            ),
          };
          if (!newState.items.some((i) => i.amount > i.paid)) {
            newState.stage = "success";
          }
          return newState;
        }),
      nextPayment: () =>
        set((state) =>
          state.stage === "success" ? { stage: "initial" } : state
        ),
    }),
    {
      name: "order-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useOrderStore;
