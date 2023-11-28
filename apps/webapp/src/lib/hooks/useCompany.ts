import { doc, getDoc } from "firebase/firestore";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Collection } from "../collections";
import { db } from "../firebase";
import { companyConverter } from "../model/companies";
import { COMPANY_QUERY } from "../queries";

export default function useCompanyFromParams() {
  const { company: companyId } = useParams();

  const queryResult = useQuery({
    queryKey: [COMPANY_QUERY, companyId],
    queryFn: async () => {
      if (companyId) {
        const res = await getDoc(
          doc(db, Collection.Companies, companyId).withConverter(
            companyConverter
          )
        );
        return res.data();
      }
    },
  });

  return queryResult;
}
