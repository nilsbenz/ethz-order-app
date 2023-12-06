import useEventStore from "@/lib/store/event";
import useOrderStore from "@/lib/store/order";
import { Article } from "@order-app/types";
import { Button, Input } from "@order-app/ui";
import { MinusIcon, PencilIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

function ListItem({ article }: { article: Article }) {
  const [item, updateItems] = useOrderStore((state) => [
    state.stage === "draft"
      ? state.items.find((i) => i.articleId === article.id)
      : undefined,
    state.updateItems,
  ]);
  const [showCommentInput, setShowCommentInput] = useState(false);

  function handleChangeAmount(change: number) {
    return () => {
      updateItems(
        item
          ? { ...item, amount: item.amount + change }
          : { articleId: article.id, amount: 1, comment: "", printed: false }
      );
    };
  }

  return (
    <div className="space-y-2 py-2">
      <div className="flex items-center">
        <p className="flex-grow">{article.displayName}</p>
        {!showCommentInput && item && !item.comment && (
          <Button
            size="icon"
            variant="ghost"
            className="mr-2 h-8 w-8"
            onClick={() => setShowCommentInput(true)}
          >
            <PencilIcon className="w-5" />
          </Button>
        )}
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8"
          onClick={handleChangeAmount(-1)}
          disabled={!item || item.amount === 0}
        >
          <MinusIcon className="w-5" />
        </Button>
        <p className="w-9 text-center font-medium tabular-nums">
          {item?.amount ?? 0}
        </p>
        <Button
          size="icon"
          variant="outline"
          className="h-8 w-8"
          onClick={handleChangeAmount(1)}
        >
          <PlusIcon className="w-5" />
        </Button>
      </div>
      {(showCommentInput || item?.comment) && (
        <Input
          value={item?.comment ?? ""}
          onChange={(e) =>
            updateItems({ ...item!, comment: e.currentTarget.value })
          }
        />
      )}
    </div>
  );
}

export default function SelectItemsCategory({
  category,
}: {
  category: string;
}) {
  const event = useEventStore((state) => state.event!);
  const articles = event.articles.filter(
    (article) => article.category === category
  );

  return (
    <div className="divide-y">
      {articles.map((article) => (
        <ListItem key={article.id} article={article} />
      ))}
    </div>
  );
}
