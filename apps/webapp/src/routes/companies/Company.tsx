import CompanyAdminsList from "@/components/companies/CompanyAdminsList";
import EventsList from "@/components/companies/EventsList";
import NewCompanyAdminForm from "@/components/companies/NewCompanyAdminForm";
import NewEventForm from "@/components/companies/NewEventForm";
import useCompanyFromParams from "@/lib/hooks/useCompany";
import { Loader2Icon } from "lucide-react";

export default function Company() {
  const { data: company, status } = useCompanyFromParams();

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

      <div className="mt-8 flex justify-between">
        <h3 className="h2">Events</h3>
        <NewEventForm company={company} />
      </div>
      <EventsList company={company} />
    </div>
  );
}
