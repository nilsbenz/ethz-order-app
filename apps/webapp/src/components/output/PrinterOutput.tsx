import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import usePrinter, { PrinterConnectionStatus } from "@/lib/hooks/usePrinter";
import { orderConverter } from "@/lib/model/orders";
import { printOrder } from "@/lib/printer";
import useEventStore from "@/lib/store/event";
import {
  Order,
  OrderStatus,
  PrinterOutput as PrinterOutputType,
} from "@order-app/types";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Input,
  Label,
  Switch,
} from "@order-app/ui";
import {
  arrayRemove,
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { ChevronsUpDownIcon, PlugIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useLocalStorage } from "usehooks-ts";

const prettyStatus: { [key in PrinterConnectionStatus]: string } = {
  [PrinterConnectionStatus.Disconnected]: "Getrennt",
  [PrinterConnectionStatus.Connecting]: "Verbindung wird aufgebaut...",
  [PrinterConnectionStatus.Connected]: "Verbunden",
  [PrinterConnectionStatus.Error]: "Fehler",
};

export default function PrinterOutput({
  output,
}: {
  output: PrinterOutputType;
}) {
  const event = useEventStore((state) => state.event!);
  const [printerIp, setPrinterIp] = useState(output.printer);
  const { printer, connectionStatus, connect } = usePrinter();
  const [history, setHistory] = useLocalStorage<Order[]>(
    `OUTPUT_${output.id}`,
    []
  );
  const [enabled, setEnabled] = useState(false);

  function handleConnect() {
    connect(printerIp);
  }

  async function print(order: Order) {
    if (printer.current && order) {
      try {
        const promises = output.outputCategories.map((cat) => {
          const filteredOrder = {
            ...order,
            items: order.items.filter((item) => {
              const article = event.articles.find(
                (a) => a.id === item.articleId
              );
              if (!article) {
                return false;
              }
              if (article.customOutput) {
                return article.customOutput === cat;
              }
              const category = event.articleCategories.find(
                (c) => c.id === article.category
              );
              return category?.output === cat;
            }),
          };
          return printOrder(printer.current!, event, filteredOrder);
        });
        await Promise.all(promises);
        setHistory([order, ...history.slice(0, 9)]);
        await updateDoc(
          doc(db, Collection.Orders, order.id).withConverter(orderConverter),
          {
            outputs: arrayRemove(...output.outputCategories),
            ...(output.outputCategories.length === order.outputs.length
              ? { status: OrderStatus.Done }
              : {}),
          }
        );
      } catch (e) {
        toast.error("Das Drucken hat nicht funktioniert...");
      }
    }
  }

  useEffect(() => {
    if (enabled) {
      const ordersQuery = query(
        collection(db, Collection.Orders).withConverter(orderConverter),
        where("eventId", "==", event.id),
        where("status", "==", OrderStatus.Confirmed),
        where("outputs", "array-contains-any", output.outputCategories),
        orderBy("createdAt"),
        limit(1)
      );
      const unsubscribe = onSnapshot(ordersQuery, (snapshot) =>
        snapshot.docs.length > 0 ? print(snapshot.docs[0].data()) : {}
      );
      return unsubscribe;
    }
  }, [event.id, enabled]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{output.displayName}</CardTitle>
        <CardDescription>
          Output{" "}
          {output.outputCategories.length > 1 ? "Kategorien" : "Kategorie"}:{" "}
          {output.outputCategories
            .map(
              (c) =>
                event.outputCategories.find((oc) => oc.id === c)?.displayName ??
                "Unbekannt"
            )
            .join(", ")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Druckerstatus: {prettyStatus[connectionStatus]}{" "}
          {connectionStatus === PrinterConnectionStatus.Connected && (
            <span className="text-muted-foreground"> ({printerIp})</span>
          )}
        </p>
        {connectionStatus === PrinterConnectionStatus.Connected ? (
          <>
            <div className="flex flex-row items-center justify-between rounded-lg border bg-background p-4">
              <Label className="text-base">Drucken</Label>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>
            <Collapsible className="space-y-2">
              <div className="flex items-center justify-between space-x-4 px-4">
                <h4 className="text-sm font-semibold">Druckverlauf</h4>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-9 p-0">
                    <ChevronsUpDownIcon className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              {history.length > 1 && (
                <div className="rounded-md border px-4 py-3 font-mono text-sm">
                  Bestellung von {history[0].table} |{" "}
                  {history[0].createdAt.toLocaleString("ch-de")}
                </div>
              )}
              {history.length > 1 && (
                <CollapsibleContent className="space-y-2">
                  {history.slice(1).map((order) => (
                    <div
                      key={order.id}
                      className="rounded-md border px-4 py-3 font-mono text-sm"
                    >
                      Bestellung von {order.table} |{" "}
                      {order.createdAt.toLocaleString("ch-de")}
                    </div>
                  ))}
                </CollapsibleContent>
              )}
            </Collapsible>
          </>
        ) : (
          <div className="flex gap-4">
            <Input
              value={printerIp}
              onChange={(e) => setPrinterIp(e.currentTarget.value)}
              disabled={connectionStatus === PrinterConnectionStatus.Connecting}
            />
            <Button
              variant="outline"
              size="icon"
              className="flex-shrink-0"
              onClick={handleConnect}
              disabled={connectionStatus === PrinterConnectionStatus.Connecting}
            >
              <PlugIcon />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
