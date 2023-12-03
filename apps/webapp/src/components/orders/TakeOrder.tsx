import useEventStore from "@/lib/store/event";
import useOrderStore from "@/lib/store/order";
import { useEffect } from "react";
import Payment from "./Payment";
import SelectItems from "./SelectItems";
import SelectTable from "./SelectTable";
import Success from "./Success";

export default function TakeOrder() {
  const orderState = useOrderStore();
  const event = useEventStore((state) => state.event!);

  useEffect(() => {
    if (orderState.stage !== "initial" && orderState.eventId !== event.id) {
      orderState.cancelOrder();
    }
  }, [orderState]);

  switch (orderState.stage) {
    case "initial":
      return <SelectTable />;
    case "draft":
      return <SelectItems />;
    case "payment":
      return <Payment />;
    case "success":
      return <Success />;
  }
}
