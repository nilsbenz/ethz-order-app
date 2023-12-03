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
import { useEffect, useState } from "react";
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
          {article?.displayName}
        </p>
        <p className="font-medium tabular-nums">
          {(item.amount * article.price).toFixed(2).replace(".00", ".–")}
        </p>
      </div>
    </div>
  );
}

export default function SelectItems() {
  const event = useEventStore((state) => state.event!);
  const orderState = useOrderStore();
  const [activeCategory, setActiveCategory] = useState("");
  const [confirm, setConfirm] = useState(false);

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
            <ConfirmItem item={item} />
          ))}
        </div>
        <Separator className="my-4" />
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
        <div className="fixed bottom-0 left-0 right-0 flex flex-col border-t border-border sm:flex-row-reverse">
          <div className="grid h-16 flex-grow grid-cols-2 place-items-center gap-4 bg-background/80 px-4 text-center backdrop-blur">
            <Button
              className="ml-auto w-full sm:max-w-[12rem]"
              size="sm"
              onClick={() => setConfirm(false)}
              variant="secondary"
            >
              Zurück
            </Button>
            <Button
              className="mr-auto w-full sm:max-w-[12rem]"
              size="sm"
              onClick={orderState.handleDraftApproved}
            >
              Bestätigen
            </Button>
          </div>
          <div className="mb-[var(--safe-area-bottom)] h-[var(--nav-height)] w-full sm:h-px sm:max-w-[5rem] lg:max-w-[12rem]" />
        </div>
        <div className="mb-[var(--safe-area-bottom)] mt-8 h-[var(--nav-height)] w-full sm:h-0 sm:max-w-[5rem] lg:max-w-[12rem]" />
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
      <div className="fixed bottom-0 left-0 right-0 flex flex-col border-t border-border sm:flex-row-reverse">
        <div className="grid h-16 flex-grow place-items-center bg-background/80 px-4 text-center backdrop-blur">
          <Button
            className="w-full sm:max-w-xs"
            size="sm"
            onClick={() => setConfirm(true)}
          >
            Weiter
          </Button>
        </div>
        <div className="mb-[var(--safe-area-bottom)] h-[var(--nav-height)] w-full sm:h-px sm:max-w-[5rem] lg:max-w-[12rem]" />
      </div>
      <div className="mb-[var(--safe-area-bottom)] mt-8 h-[var(--nav-height)] w-full sm:h-0 sm:max-w-[5rem] lg:max-w-[12rem]" />
    </>
  );
}
