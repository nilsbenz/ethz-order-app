import useOrderStore from "@/lib/store/order";
import { Button } from "@order-app/ui";
import { RotateCcwIcon } from "lucide-react";

export default function Success() {
  const nextOrder = useOrderStore((state) => state.cancelOrder);

  return (
    <>
      <p>Die Bestellung wurde erfolgreich abgeschlossen.</p>
      <Button onClick={nextOrder}>
        Nächste Bestellung
        <RotateCcwIcon className="ml-2 w-5" strokeWidth={2.25} />
      </Button>
    </>
  );
}
