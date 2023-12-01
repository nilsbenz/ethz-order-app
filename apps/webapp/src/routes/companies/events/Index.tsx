import TableView from "@/components/lists/TableView";
import TableViewCell from "@/components/lists/TableViewCell";
import { COMPANY_QUERY } from "@/lib/queries";
import useCompanyStore from "@/lib/store/company";
import { Company } from "@order-app/types";
import { Loader2Icon } from "lucide-react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export default function Events() {
  const { company: companyId } = useParams();
  const { data: company, status } = useQuery<Company>({
    queryKey: [COMPANY_QUERY, companyId],
    enabled: false,
  });

  const events = useCompanyStore((state) => state.events);

  if (status === "loading") {
    return (
      <div className="grid min-h-[40vh] place-items-center delay-200 duration-500 animate-in fade-in-0 fill-mode-backwards">
        <Loader2Icon className="animate-spin text-border" />
      </div>
    );
  }

  if (!company) {
    return <>company not found</>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="h1">Events</h2>
      <TableView loading={!events}>
        {events?.map((event, index) => (
          <TableViewCell
            key={index}
            label={event.displayName}
            link={event.id}
          />
        ))}
      </TableView>
    </div>
  );
}
