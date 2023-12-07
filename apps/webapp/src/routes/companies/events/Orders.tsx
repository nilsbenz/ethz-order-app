import AddOutputForm from "@/components/output/AddOutputForm";
import PrinterOutput from "@/components/output/PrinterOutput";
import { EVENT_QUERY } from "@/lib/queries";
import useEventStore from "@/lib/store/event";
import { Loader2Icon } from "lucide-react";
import { EventType } from "react-hook-form";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export default function Orders() {
  const { event: eventId } = useParams();
  const { status } = useQuery<EventType>({
    queryKey: [EVENT_QUERY, eventId],
    enabled: false,
  });
  const event = useEventStore((state) => state.event);

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
      <div className="flex items-center justify-between">
        <h2 className="h1">Bestellungen</h2>
        <AddOutputForm />
      </div>
      {event.printers.map((printerOutput) => (
        <PrinterOutput key={printerOutput.id} output={printerOutput} />
      ))}
    </div>
  );
}
