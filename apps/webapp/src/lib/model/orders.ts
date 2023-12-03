import { Order } from "@order-app/types";
import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";

type DbOrder = Omit<Order, "id">;
export const orderConverter: FirestoreDataConverter<Order, DbOrder> = {
  toFirestore: (order: Order) => {
    const res: DbOrder & { id?: string } = { ...order };
    delete res.id;
    return res;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): Order => {
    const data = snapshot.data() as DbOrder;
    return {
      id: snapshot.id,
      ...data,
      createdAt: (data.createdAt as unknown as Timestamp).toDate(),
    } as Order;
  },
};
