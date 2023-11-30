import { getDisplayColor } from "@/lib/articles";
import useEventStore from "@/lib/store/event";
import { Article, ArticleCategory } from "@order-app/types";
import { cn } from "@order-app/ui";
import { Loader2Icon } from "lucide-react";
import TableView from "../lists/TableView";
import ArticlesListItem from "./ArticlesListItem";

export default function ArticlesList() {
  const event = useEventStore((state) => state.event);

  const articles = event?.articles.filter((a) => !a.archived) ?? [];
  const sortedArticles: {
    [key: string]: { category: ArticleCategory; articles: Article[] };
  } = Object.fromEntries(
    event?.articleCategories
      .sort((a, b) => (a.displayName < b.displayName ? -1 : 1))
      .map((category) => [category.id, { category, articles: [] }]) ?? []
  );
  articles.forEach((a) => sortedArticles[a.category].articles.push(a));
  Object.keys(sortedArticles).forEach((category) =>
    sortedArticles[category].articles.sort((a, b) =>
      a.displayName < b.displayName ? -1 : 1
    )
  );

  if (!event) {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2Icon className="animate-spin text-border delay-200 duration-500 animate-in fade-in-0 fill-mode-backwards" />
      </div>
    );
  }

  if (articles.length === 0) {
    return <p>Es wurden noch keine Artikel erfasst.</p>;
  }

  return (
    <>
      {Object.keys(sortedArticles).map((category, index) => (
        <div key={category} className={cn("space-y-2", index > 0 && "pt-4")}>
          <h3 className="h2 flex items-center gap-2">
            <div
              className={cn(
                "h-5 w-5 rounded border border-black/20",
                getDisplayColor(sortedArticles[category].category.color)
              )}
            />
            {sortedArticles[category].category.displayName}
          </h3>
          <TableView loading={!event}>
            {sortedArticles[category].articles.map((article) => (
              <ArticlesListItem key={article.id} article={article} />
            ))}
          </TableView>
        </div>
      ))}
    </>
  );
}
