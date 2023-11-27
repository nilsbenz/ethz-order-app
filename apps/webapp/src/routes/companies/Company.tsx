import CompanyAdminsList from "@/components/companies/CompanyAdminsList";
import NewCompanyAdminForm from "@/components/companies/NewCompanyAdminForm";
import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { companyConverter } from "@/lib/model/companies";
import { COMPANY_QUERY } from "@/lib/queries";
import { doc, getDoc } from "firebase/firestore";
import { Loader2Icon } from "lucide-react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export default function Company() {
  const { company: companyId } = useParams();

  const { data: company, status } = useQuery({
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

  if (status === "loading") {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2Icon className="animate-spin text-border" />
      </div>
    );
  }

  if (!company) {
    return <>company not found</>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="h1">{company.displayName}</h2>

      <div className="flex justify-between">
        <h3 className="h2">Admins</h3>
        <NewCompanyAdminForm company={company} />
      </div>
      <CompanyAdminsList company={company} />
    </div>
  );
}
