import EventsList from "@/components/companies/EventsList";
import NewEventForm from "@/components/companies/NewEventForm";
import useCompanyFromParams from "@/lib/hooks/useCompany";
import { Loader2Icon } from "lucide-react";

export default function Events() {
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
      <div className="flex items-center justify-between">
        <h2 className="h1">Events</h2>
        <NewEventForm company={company} />
      </div>
      <EventsList company={company} />
    </div>
  );
}
