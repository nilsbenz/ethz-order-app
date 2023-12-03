import useOrderStore from "@/lib/store/order";
import { Button } from "@order-app/ui";
import { RotateCcwIcon } from "lucide-react";
import { useState } from "react";
import ConfirmActionDialog from "../common/ConfirmActionDialog";
import SelectTable from "./SelectTable";

function TakeOrderStage() {
  const stage = useOrderStore((state) => state.stage);

  switch (stage) {
    case "initial":
      return <SelectTable />;
    case "draft":
      return "draft";
    case "payment":
      return "payment";
    case "success":
      return "success";
  }
}

export default function TakeOrder() {
  const [openCancelConfirmDialog, setOpenCancelConfirmDialog] = useState(false);
  const [stage, cancelOrder] = useOrderStore((state) => [
    state.stage,
    state.cancelOrder,
  ]);

  return (
    <>
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
      <TakeOrderStage />
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
    </>
  );
}
