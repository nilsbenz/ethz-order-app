import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase/firestore";

export function createSimpleConverter<
  T extends { id: string },
>(): FirestoreDataConverter<T> {
  type DbT = Omit<T, "id">;
  return {
    toFirestore: (event: T) => {
      const res: DbT & { id?: string } = { ...event };
      delete res.id;
      return res;
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot): T => {
      const data = snapshot.data() as DbT;
      return { id: snapshot.id, ...data } as T;
    },
  };
}
