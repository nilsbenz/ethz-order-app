import useEventStore from "@/lib/store/event";
import useOrderStore from "@/lib/store/order";
import { OrderItem } from "@order-app/types";
import { Button } from "@order-app/ui";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import BottomAction from "../layout/BottomAction";

function ListItem({
  item,
  currentPayment,
  onChangeAmount,
}: {
  item: OrderItem & { paid: number };
  currentPayment: number;
  onChangeAmount: (change: number) => void;
}) {
  const article = useEventStore(
    (state) => state.event?.articles.find((a) => a.id === item.articleId)
  );

  if (!article) {
    return <div className="space-y-2 py-2">Artikel nicht gefunden!</div>;
  }

  return (
    <div className="space-y-2 py-2">
      <div className="flex items-center">
        <p className="flex-grow">
          <span className="inline-block min-w-[1.5rem] text-right font-medium tabular-nums">
            {item.amount} x
          </span>{" "}
          {article.displayName}
        </p>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8"
          onClick={() => onChangeAmount(-1)}
          disabled={currentPayment <= 0}
        >
          <MinusIcon className="w-5" />
        </Button>
        <p className="w-16 text-center font-medium tabular-nums">
          {currentPayment}{" "}
          <span className="text-sm text-muted-foreground">
            / {item.amount - item.paid}
          </span>
        </p>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8"
          onClick={() => onChangeAmount(1)}
          disabled={currentPayment + item.paid >= item.amount}
        >
          <PlusIcon className="w-5" />
        </Button>
      </div>
    </div>
  );
}

export default function Payment() {
  const event = useEventStore((state) => state.event!);
  const orderState = useOrderStore();
  const [currentPayment, setCurrentPayment] = useState<
    { articleId: string; amount: number }[]
  >([]);

  function handleChangeAmount(articleId: string) {
    return (change: number) => {
      setCurrentPayment((prev) =>
        prev.some((x) => x.articleId === articleId)
          ? prev.map((x) =>
              x.articleId === articleId
                ? { ...x, amount: x.amount + change }
                : x
            )
          : [...prev, { articleId, amount: 1 }]
      );
    };
  }

  function handleNextClicked() {
    currentPayment.forEach((payment) => {
      orderState.updatePayments(payment.articleId, payment.amount);
    });
    setCurrentPayment([]);
  }

  if (orderState.stage !== "payment") {
    return null;
  }

  return (
    <>
      <div className="divide-y">
        {orderState.items.map((item) => (
          <ListItem
            key={item.articleId}
            item={item}
            currentPayment={
              currentPayment.find((x) => x.articleId === item.articleId)
                ?.amount ?? 0
            }
            onChangeAmount={handleChangeAmount(item.articleId)}
          />
        ))}
      </div>
      <div>
        <div className="flex items-end justify-between">
          <p className="font-medium">Total</p>
          <p className="text-xl font-medium">
            {orderState.items
              .reduce(
                (acc, curr) =>
                  acc +
                  (event.articles.find((i) => i.id === curr.articleId)?.price ??
                    0) *
                    (currentPayment.find((i) => i.articleId === curr.articleId)
                      ?.amount ?? 0),
                0
              )
              .toFixed(2)
              .replace(".00", ".–")}
          </p>
        </div>
        <BottomAction>
          <Button className="w-full sm:max-w-xs" onClick={handleNextClicked}>
            {orderState.items.some(
              (i) =>
                i.amount >
                i.paid +
                  (currentPayment.find((p) => p.articleId === i.articleId)
                    ?.amount ?? 0)
            )
              ? "Nächste Zahlung"
              : "Bestellung abschliessen"}
          </Button>
        </BottomAction>
      </div>
    </>
  );
}
