import useOrderStore from "@/lib/store/order";
import { Button } from "@order-app/ui";

export default function Success() {
  const nextOrder = useOrderStore((state) => state.cancelOrder);

  return (
    <>
      <p>Die Bestellung wurde erfolgreich abgeschlossen.</p>
      <Button onClick={nextOrder}>Nächste Bestellung</Button>
    </>
  );
}
