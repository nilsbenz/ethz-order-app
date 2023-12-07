import { EVENT_QUERY } from "@/lib/queries";
import useEventStore from "@/lib/store/event";
import useOrderStore from "@/lib/store/order";
import { Button } from "@order-app/ui";
import { RotateCcwIcon } from "lucide-react";
import { useQueryClient } from "react-query";

export default function Success() {
  const event = useEventStore((state) => state.event);
  const nextOrder = useOrderStore((state) => state.cancelOrder);
  const queryClient = useQueryClient();

  function handleNextOrderClicked() {
    queryClient.invalidateQueries({ queryKey: [EVENT_QUERY, event?.id] });
    nextOrder();
  }

  return (
    <>
      <p>Die Bestellung wurde erfolgreich abgeschlossen.</p>
      <Button onClick={handleNextOrderClicked}>
        Nächste Bestellung
        <RotateCcwIcon className="ml-2 w-5" strokeWidth={2.25} />
      </Button>
    </>
  );
}
