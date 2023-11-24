import { Company, DbCompany } from "@order-app/types";
import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase/firestore";

export const companyConverter: FirestoreDataConverter<Company, DbCompany> = {
  toFirestore: (company: Company) => {
    const res: DbCompany & { id?: string } = { ...company };
    delete res.id;
    return res;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): Company => {
    const data = snapshot.data() as DbCompany;
    return { id: snapshot.id, ...data };
  },
};
