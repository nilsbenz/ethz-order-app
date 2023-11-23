import { AppUser, DbAppUser } from "@order-app/types";
import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase/firestore";

export const appUserConverter: FirestoreDataConverter<AppUser, DbAppUser> = {
  toFirestore: (appUser: AppUser) => {
    const res: DbAppUser & { id?: string } = { ...appUser };
    delete res.id;
    return res;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): AppUser => {
    const data = snapshot.data() as DbAppUser;
    return { id: snapshot.id, ...data };
  },
};
