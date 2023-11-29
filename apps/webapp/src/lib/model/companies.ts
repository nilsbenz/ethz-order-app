import { Company, Event } from "@order-app/types";
import { createSimpleConverter } from "./common";
import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase/firestore";

export const companyConverter = createSimpleConverter<Company>();

type DbEvent = Omit<Event, "id">;
export const eventConverter: FirestoreDataConverter<Event, DbEvent> = {
  toFirestore: (event: Event) => {
    const res: DbEvent & { id?: string } = { ...event };
    delete res.id;
    return res;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): Event => {
    const data = snapshot.data() as DbEvent;
    return {
      id: snapshot.id,
      ...data,
      waiters: data.waiters.map((w) => ({
        ...w,
        checkedInAt: (w.checkedInAt as unknown as Timestamp).toDate(),
        disableAt: (w.disableAt as unknown as Timestamp).toDate(),
      })),
    } as Event;
  },
};
