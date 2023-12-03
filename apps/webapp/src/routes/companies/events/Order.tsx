import ConfirmActionDialog from "@/components/common/ConfirmActionDialog";
import TakeOrder from "@/components/orders/TakeOrder";
import { EVENT_QUERY } from "@/lib/queries";
import useOrderStore from "@/lib/store/order";
import { Event as EventType } from "@order-app/types";
import { Button } from "@order-app/ui";
import { Loader2Icon, RotateCcwIcon } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export default function Order() {
  const { event: eventId } = useParams();
  const { data: event, status } = useQuery<EventType>({
    queryKey: [EVENT_QUERY, eventId],
    enabled: false,
  });
  const [openCancelConfirmDialog, setOpenCancelConfirmDialog] = useState(false);
  const [stage, cancelOrder] = useOrderStore((state) => [
    state.stage,
    state.cancelOrder,
  ]);

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
        <h2 className="h1">Neue Bestellung</h2>
        {stage !== "initial" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpenCancelConfirmDialog(true)}
          >
            <RotateCcwIcon />
          </Button>
        )}
      </div>
      <TakeOrder />
      <ConfirmActionDialog
        open={openCancelConfirmDialog}
        onOpenChange={setOpenCancelConfirmDialog}
        heading="Bestellung abbrechen?"
        confirmText="Bestätigen"
        onConfirm={() => {
          cancelOrder();
          setOpenCancelConfirmDialog(false);
        }}
        busy={false}
      >
        Bist du dir sicher, dass die Bestellung abgebrochen werden soll? Dies
        kann nicht rückgängig gemacht werden.
      </ConfirmActionDialog>
    </div>
  );
}
