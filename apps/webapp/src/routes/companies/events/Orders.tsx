import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import usePrinter from "@/lib/hooks/usePrinter";
import { orderConverter } from "@/lib/model/orders";
import { EVENT_QUERY } from "@/lib/queries";
import useEventStore from "@/lib/store/event";
import { Order, OrderStatus } from "@order-app/types";
import { Button, Input, Separator } from "@order-app/ui";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Loader2Icon } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
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
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const [printerIPAddress, setPrinterIPAddress] = useState("192.168.1.192");
  const [printerPort, setPrinterPort] = useState("8043");

  const { printer, connectionStatus, connect } = usePrinter();

  function handleConnect(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    connect(printerIPAddress, printerPort);
  }

  function handlePrint() {
    const prn = printer.current;
    if (!prn) {
      alert("Not connected to printer");
      return;
    }

    prn.addText(`Tisch: ${currentOrder?.table}`);
    prn.addHLine(5, 15, undefined);
    prn.addText("Artikel:");
    currentOrder?.items.forEach((item) => {
      prn.addText(
        `    ${item.amount} x ${event?.articles.find(
          (a) => a.id === item.articleId
        )?.displayName}`
      );
      if (item.comment) {
        prn.addText(`        ${item.comment}`);
      }
    });
    prn.addFeedLine(3);
    prn.addCut("CUT_FEED");

    prn.send();
  }

  async function handleOrderDone() {
    if (!currentOrder) {
      return;
    }
    await updateDoc(
      doc(db, Collection.Orders, currentOrder.id).withConverter(orderConverter),
      { status: OrderStatus.Done }
    );
  }

  useEffect(() => {
    if (eventId) {
      const ordersQuery = query(
        collection(db, Collection.Orders).withConverter(orderConverter),
        where("eventId", "==", eventId),
        where("status", "==", OrderStatus.Confirmed),
        orderBy("createdAt"),
        limit(1)
      );
      const unsubscribe = onSnapshot(ordersQuery, (snapshot) =>
        setCurrentOrder(
          snapshot.docs.length > 0 ? snapshot.docs[0].data() : null
        )
      );
      return unsubscribe;
    }
  }, [eventId]);

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

  if (!currentOrder) {
    return <p>Aktuell ist keine Bestellung offen.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="h1">Drucker</h2>
      <form className="grid grid-cols-2 gap-4" onSubmit={handleConnect}>
        <Input
          placeholder="Printer IP Address"
          value={printerIPAddress}
          onChange={(e) => setPrinterIPAddress(e.currentTarget.value)}
        />
        <Input
          placeholder="Printer Port"
          value={printerPort}
          onChange={(e) => setPrinterPort(e.currentTarget.value)}
        />
        <Button
          disabled={connectionStatus === "Connected"}
          className="col-span-2"
        >
          Connect
        </Button>
      </form>
      <p>Connection status: {connectionStatus}</p>
      <Separator />
      <h2 className="h1">Aktuelle Bestellung</h2>
      <p>Tisch: {currentOrder?.table}</p>
      <div>
        <p>Artikel:</p>
        <div className="pl-4">
          {currentOrder.items.map((item) => (
            <div key={item.articleId}>
              <p>
                {item.amount} x{" "}
                {
                  event.articles.find((a) => a.id === item.articleId)
                    ?.displayName
                }
              </p>
              {item.comment && (
                <p className="pl-4 text-muted-foreground">{item.comment}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button onClick={handlePrint} variant="outline">
          Bestellung drucken
        </Button>
        <Button onClick={handleOrderDone}>Bestellung abgeschlossen</Button>
      </div>
    </div>
  );
}
