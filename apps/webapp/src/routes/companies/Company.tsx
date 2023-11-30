import CompanyAdminsList from "@/components/companies/CompanyAdminsList";
import EventsList from "@/components/companies/EventsList";
import NewCompanyAdminForm from "@/components/companies/NewCompanyAdminForm";
import NewEventForm from "@/components/companies/NewEventForm";
import { COMPANY_QUERY } from "@/lib/queries";
import { Company as CompanyType } from "@order-app/types";
import { Loader2Icon } from "lucide-react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export default function Company() {
  const { company: companyId } = useParams();
  const { data: company, status } = useQuery<CompanyType>({
    queryKey: [COMPANY_QUERY, companyId],
    enabled: false,
  });

  if (status === "loading") {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2Icon className="animate-spin text-border delay-200 duration-500 animate-in fade-in-0 fill-mode-backwards" />
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
        <NewCompanyAdminForm />
      </div>
      <CompanyAdminsList />

      <div className="mt-8 flex justify-between">
        <h3 className="h2">Events</h3>
        <NewEventForm />
      </div>
      <EventsList />
    </div>
  );
}
