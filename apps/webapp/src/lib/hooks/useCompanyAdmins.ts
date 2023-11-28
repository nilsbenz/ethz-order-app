import { AppUser, UserLevel } from "@order-app/types";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Collection } from "../collections";
import { db } from "../firebase";
import { appUserConverter } from "../model/users";
import useAuthStore from "../store/auth";

export default function useCompanyAdmins({
  companyId,
  callback,
}: {
  companyId?: string;
  callback?: (admins: AppUser[]) => void;
}) {
  const userData = useAuthStore((state) => state.userData);
  const [companyAdmins, setCompanyAdmins] = useState<AppUser[]>();

  const company = companyId ?? userData?.company ?? null;

  useEffect(() => {
    if (userData?.id && company) {
      const companyAdminsQuery = query(
        collection(db, Collection.Users),
        where("level", "==", UserLevel.Admin),
        where("company", "==", company)
      ).withConverter(appUserConverter);
      const unsubscribe = onSnapshot(companyAdminsQuery, (snapshot) => {
        const admins = snapshot.docs.map((d) => d.data());
        setCompanyAdmins(admins);
        callback?.(admins);
      });
      return unsubscribe;
    }
  }, [userData?.id, company, callback]);

  return companyAdmins;
}
