import TableView from "@/components/lists/TableView";
import TableViewCell from "@/components/lists/TableViewCell";
import { SubPage } from "@/lib/pages";
import { EVENT_QUERY } from "@/lib/queries";
import { Event as EventType } from "@order-app/types";
import { Loader2Icon } from "lucide-react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const actions = [
  { label: "Artikel bearbeiten", link: SubPage.Articles },
  { label: "Tische bearbeiten", link: SubPage.Tables },
  { label: "Personal verwalten", link: SubPage.Waiters },
  { label: "Beitrittscode", link: SubPage.Join },
] as const;

export default function Event() {
  const { event: eventId } = useParams();
  const { data: event, status } = useQuery<EventType>({
    queryKey: [EVENT_QUERY, eventId],
    enabled: false,
  });

  if (status === "loading") {
    return (
      <div className="grid min-h-[40vh] place-items-center delay-200 duration-500 animate-in fade-in-0 fill-mode-backwards">
        <Loader2Icon className="animate-spin text-border" />
      </div>
    );
  }

  if (!event) {
    return <>event not found</>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="h1">{event.displayName}</h2>
      <TableView>
        {actions.map((action, index) => (
          <TableViewCell key={index} {...action} />
        ))}
      </TableView>
    </div>
  );
}
