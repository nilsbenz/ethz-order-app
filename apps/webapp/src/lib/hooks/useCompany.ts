import { Company } from "@order-app/types";
import { doc, getDoc } from "firebase/firestore";
import { useQuery } from "react-query";
import { Collection } from "../collections";
import { db } from "../firebase";
import { companyConverter } from "../model/companies";
import { COMPANY_QUERY } from "../queries";
import useAuthStore from "../store/auth";

export default function useCompany({
  companyId,
  callback,
}: {
  companyId?: string;
  callback?: (company: Company | undefined) => void;
}) {
  const userData = useAuthStore((state) => state.userData);

  const company = companyId ?? userData?.company ?? null;

  const queryResult = useQuery({
    queryKey: [COMPANY_QUERY, company],
    queryFn: async () => {
      if (company) {
        const res = await getDoc(
          doc(db, Collection.Companies, company).withConverter(companyConverter)
        );
        return res.data();
      }
    },
    onSettled: (data) => callback?.(data),
  });

  return queryResult;
}
