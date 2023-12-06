import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { orderConverter } from "@/lib/model/orders";
import { EVENT_QUERY, ORDERS_QUERY } from "@/lib/queries";
import useEventStore from "@/lib/store/event";
import { Event, Order, OrderStatus } from "@order-app/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Loader2Icon } from "lucide-react";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export default function Visualizations() {
  const { event: eventId } = useParams();
  const { status: eventStatus } = useQuery({
    queryKey: [EVENT_QUERY, eventId],
    enabled: false,
  });
  const event: Event | undefined = useEventStore((state) => state.event);

  const { data: orders, status: ordersStatus } = useQuery<Order[]>({
    queryKey: [ORDERS_QUERY, eventId],
    queryFn: async () => {
      const ordersQuery = query(
        collection(db, Collection.Orders).withConverter(orderConverter),
        where("eventId", "==", eventId),
        where("status", "==", OrderStatus.Done)
      );
      const snapshots = await getDocs(ordersQuery);
      return snapshots.docs.map((s) => s.data());
    },
  });

  useEffect(() => {}, [eventId]);

  if (eventStatus === "loading") {
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
      <h2 className="h1">Auswertung</h2>
      <p className="text-red-500">
        <b>README</b>: d bstelliga werded id variable <b>orders</b> glade, die
        hönd de typ Order (isch importiert, kame im types package go noluege).
        <br />d artikel und di verschidene kategorie sind i de <b>event</b>{" "}
        variable, de typ Event isch ebefalls importiert. mit{" "}
        <b>event.articles</b> und <b>event.articleCategories</b> kunnt me zu de
        verschidene artikel.
        <br />
        ha d bstellige das kein build fehler git eifach mol alli azeigt, da
        könder wider lösche und d visualisierige ifüege.
      </p>
      {ordersStatus !== "success" ? (
        <p>Die Bestellungen werden geladen...</p>
      ) : (
        <div>
          {orders.map((order) => (
            <p key={order.id}>Bestellung für Tisch {order.table}</p>
          ))}
        </div>
      )}
    </div>
  );
}
