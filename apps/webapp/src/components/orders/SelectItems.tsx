import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { orderConverter } from "@/lib/model/orders";
import useAuthStore from "@/lib/store/auth";
import useEventStore from "@/lib/store/event";
import useOrderStore from "@/lib/store/order";
import { getTableLabel } from "@/lib/tables";
import { OrderItem } from "@order-app/types";
import {
  Button,
  ScrollArea,
  ScrollBar,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  cn,
} from "@order-app/ui";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import BottomAction from "../layout/BottomAction";
import SelectItemsCategory from "./SelectItemsCategory";

function ConfirmItem({ item }: { item: OrderItem }) {
  const article = useEventStore(
    (state) => state.event?.articles.find((a) => a.id === item.articleId)
  );

  if (!article) {
    return <div className="py-2">Artikel nicht gefunden!</div>;
  }

  return (
    <div className="py-2">
      <div className="flex justify-between">
        <p>
          <span className="inline-block min-w-[1.5rem] text-right font-medium tabular-nums">
            {item.amount} x
          </span>{" "}
          {article.displayName}
        </p>
        <p className="font-medium tabular-nums">
          {(item.amount * article.price).toFixed(2).replace(".00", ".–")}
        </p>
      </div>
    </div>
  );
}

export default function SelectItems() {
  const user = useAuthStore((state) => state.user!);
  const event = useEventStore((state) => state.event!);
  const orderState = useOrderStore();
  const [activeCategory, setActiveCategory] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleConfirm() {
    if (orderState.stage !== "draft") {
      return;
    }
    try {
      setBusy(true);
      await addDoc(
        collection(db, Collection.Orders).withConverter(orderConverter),
        {
          id: "",
          eventId: event.id,
          createdBy: user.uid,
          createdAt: new Date(),
          table: orderState.table,
          items: orderState.items,
        }
      );
      orderState.handleDraftApproved();
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (
      (!activeCategory ||
        !event.articleCategories.some((c) => c.id === activeCategory)) &&
      event.articleCategories.length > 0
    ) {
      setActiveCategory(event.articleCategories[0].id);
    }
  }, [event.articleCategories]);

  if (orderState.stage !== "draft") {
    return null;
  }

  if (confirm) {
    return (
      <>
        <p className="flex items-end justify-between font-medium">
          <span>Tisch</span>
          <span className="text-xl">{orderState.table}</span>
        </p>
        <Separator className="my-4" />
        <div className="divide-y">
          {orderState.items.map((item) => (
            <ConfirmItem key={item.articleId} item={item} />
          ))}
        </div>
        <Separator className="my-4" />
        <div>
          <div className="flex items-end justify-between">
            <p className="font-medium">Total</p>
            <p className="text-xl font-medium">
              {event.articles
                .reduce(
                  (acc, curr) =>
                    acc +
                    curr.price *
                      (orderState.items.find((i) => i.articleId === curr.id)
                        ?.amount ?? 0),
                  0
                )
                .toFixed(2)
                .replace(".00", ".–")}
            </p>
          </div>
          <BottomAction className="grid-cols-2 gap-4">
            <Button
              className="ml-auto w-full sm:max-w-[12rem]"
              size="sm"
              onClick={() => setConfirm(false)}
              variant="secondary"
              disabled={busy}
            >
              Zurück
            </Button>
            <Button
              className="mr-auto w-full sm:max-w-[12rem]"
              size="sm"
              onClick={handleConfirm}
              disabled={busy}
            >
              Bestätigen
            </Button>
          </BottomAction>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex items-center gap-4">
        <p>Tisch</p>
        <Select value={orderState.table} onValueChange={orderState.changeTable}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {event.tables.tables.map(({ col, row }) => {
              const table =
                getTableLabel(col, event.tables.colLabels) +
                getTableLabel(row, event.tables.rowLabels);
              return (
                <SelectItem value={table} key={table}>
                  {table}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <Separator className="my-4" />
      <ScrollArea className="whitespace-nowrap rounded-md border border-border bg-muted px-1">
        <div className="flex gap-1 py-1 text-sm font-medium text-muted-foreground">
          {event.articleCategories.map((category) => (
            <button
              key={category.id}
              className={cn(
                "scroll-mt-4 rounded px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted",
                activeCategory === category.id &&
                  "bg-background text-foreground"
              )}
              onClick={(e) => {
                setActiveCategory(category.id);
                e.currentTarget.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {category.displayName}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>
      <SelectItemsCategory category={activeCategory} />
      <BottomAction>
        <Button
          className="w-full sm:max-w-xs"
          size="sm"
          onClick={() => setConfirm(true)}
        >
          Weiter
        </Button>
      </BottomAction>
    </>
  );
}
