import { Order, OrderStatus } from "@order-app/types";
import {
  arrayRemove,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { useEffect } from "react";
import { Collection } from "../../lib/collections";
import { db } from "../../lib/firebase";
import { orderConverter } from "../../lib/model/orders";
import useEventStore from "../../lib/store/event";
import { default as useOutputStore } from "../../lib/store/output";

export default function Print() {
  const event = useEventStore((state) => state.event);
  const [categories, printed, resetPrinted] = useOutputStore((state) => [
    state.categoryListeners,
    state.printedCategories,
    state.resetPrintedCategories,
  ]);
  const [currentOrder, setCurrentOrder] = useOutputStore((state) => [
    state.currentOrder,
    state.setCurrentOrder,
  ]);

  async function removeOutputs(order: Order, remove: string[]) {
    const batch = writeBatch(db);
    const orderRef = doc(db, Collection.Orders, order.id).withConverter(
      orderConverter
    );
    remove.forEach((p) => batch.update(orderRef, { outputs: arrayRemove(p) }));
    if (remove.length === order.outputs.length) {
      batch.update(orderRef, { status: OrderStatus.Done });
    }
    await batch.commit();
  }

  useEffect(() => {
    if (event && categories.length > 0) {
      const ordersQuery = query(
        collection(db, Collection.Orders).withConverter(orderConverter),
        where("eventId", "==", event.id),
        where("status", "==", OrderStatus.Confirmed),
        where("outputs", "array-contains-any", categories),
        orderBy("createdAt"),
        limit(1)
      );
      const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
        if (snapshot.docs.length > 0) {
          const order = snapshot.docs[0];
          if (currentOrder?.id !== order.id) {
            resetPrinted();
            setCurrentOrder(order.data());
          }
        } else {
          setCurrentOrder(null);
        }
      });
      return unsubscribe;
    }
  }, [event?.id, categories]);

  useEffect(() => {
    if (currentOrder) {
      const shouldPrint = categories.filter((c) =>
        currentOrder.outputs.includes(c)
      );
      if (
        shouldPrint.length === printed.length &&
        shouldPrint.every((c) => printed.includes(c))
      ) {
        removeOutputs(currentOrder, printed);
      }
    }
  }, [printed]);

  return (
    <div className="rounded-lg border border-border p-4">
      <p>Es werden folgende Kategorien gedruckt:</p>
      {categories.length > 0 ? (
        <p>
          {categories
            .map(
              (c) =>
                event?.outputCategories.find((oc) => c === oc.id)
                  ?.displayName ?? c
            )
            .join(", ")}
        </p>
      ) : (
        <p>Keine</p>
      )}
    </div>
  );
}
