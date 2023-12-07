import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { orderConverter } from "@/lib/model/orders";
import { getOutputCategories } from "@/lib/orders";
import useAuthStore from "@/lib/store/auth";
import useEventStore from "@/lib/store/event";
import useOrderStore from "@/lib/store/order";
import { getTableLabel } from "@/lib/tables";
import { OrderItem, OrderStatus } from "@order-app/types";
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
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  cn,
} from "@order-app/ui";
import { addDoc, collection } from "firebase/firestore";
import {
  ArrowBigLeftIcon,
  ArrowBigRightIcon,
  MenuIcon,
  PrinterIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import BottomAction from "../layout/BottomAction";
import SelectItemsCategory from "./SelectItemsCategory";
import SelectSelfServiceNumber from "./SelectSelfServiceNumber";

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
        <div>
          <p>
            <span className="inline-block min-w-[1.5rem] text-right font-medium tabular-nums">
              {item.amount} x
            </span>{" "}
            {article.displayName}
          </p>
          {item.comment && (
            <p className="text-muted-foreground">{item.comment}</p>
          )}
        </div>
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
  const [openSelfServiceNumber, setOpenSelfServiceNumber] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);

  function handleSubmitSelfService(n: number) {
    orderState.changeTable(event.tables.selfServicePrefix + n);
    setOpenSelfServiceNumber(false);
  }

  function handleOpenSelfServiceNumberChange(open: boolean) {
    if (orderState.stage === "draft" && !open) {
      orderState.changeTable(
        orderState.table.slice(event.tables.selfServicePrefix.length + 1, -1)
      );
    }
    setOpenSelfServiceNumber(open);
  }

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
          status: OrderStatus.Confirmed,
          eventId: event.id,
          createdBy: user.uid,
          createdAt: new Date(),
          table: orderState.table,
          items: orderState.items,
          outputs: getOutputCategories(event, orderState.items),
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

  const table = orderState.stage === "draft" ? orderState.table : null;
  useEffect(() => {
    if (table?.startsWith(`${event.tables.selfServicePrefix}[`)) {
      setOpenSelfServiceNumber(true);
    }
  }, [table]);

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
              className="ml-auto w-full dark:bg-background sm:max-w-[12rem]"
              size="sm"
              onClick={() => setConfirm(false)}
              variant="secondary"
              disabled={busy}
            >
              <ArrowBigLeftIcon className="mr-1 w-5" strokeWidth={2.25} />
              Zurück
            </Button>
            <Button
              className="mr-auto w-full sm:max-w-[12rem]"
              size="sm"
              onClick={handleConfirm}
              disabled={busy}
            >
              Absenden
              <PrinterIcon className="ml-2 w-5" strokeWidth={2.25} />
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
            {event.tables.hasSelfService &&
              (orderState.table.startsWith(event.tables.selfServicePrefix) ? (
                <SelectItem value={orderState.table}>
                  {orderState.table}
                </SelectItem>
              ) : (
                <SelectItem
                  value={`${event.tables.selfServicePrefix}[${orderState.table}]`}
                >
                  Selbstbedienung
                </SelectItem>
              ))}
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
      <div className="flex h-12 rounded-lg border border-border bg-muted">
        <ScrollArea className="flex-grow whitespace-nowrap px-1">
          <div className="flex gap-1 py-1 text-sm font-medium text-muted-foreground">
            {event.articleCategories.map((category) => (
              <button
                key={category.id}
                className={cn(
                  "scroll-mt-4 rounded px-3 py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted",
                  activeCategory === category.id &&
                    "bg-background text-foreground"
                )}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.displayName}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-1.5" />
        </ScrollArea>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="icon"
              variant="outline"
              className="mr-[3px] flex-shrink-0 self-center"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Kategorie wählen</SheetTitle>
              <SheetDescription className="flex flex-col divide-y">
                {event.articleCategories.map((category) => (
                  <SheetClose key={category.id} asChild>
                    <button
                      className={cn(
                        "-mx-2 rounded px-2 py-3 text-left text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                        activeCategory === category.id &&
                          "font-medium text-foreground"
                      )}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.displayName}
                    </button>
                  </SheetClose>
                ))}
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
      <SelectItemsCategory category={activeCategory} />
      <BottomAction>
        <Button
          className="w-full sm:max-w-xs"
          size="sm"
          onClick={() => setConfirm(true)}
          disabled={orderState.items.length === 0}
        >
          Weiter
          <ArrowBigRightIcon className="ml-1 w-5" strokeWidth={2.25} />
        </Button>
      </BottomAction>
      <SelectSelfServiceNumber
        open={openSelfServiceNumber}
        onOpenChange={handleOpenSelfServiceNumberChange}
        onSubmit={handleSubmitSelfService}
      />
    </>
  );
}
