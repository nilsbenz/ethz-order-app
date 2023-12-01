import useEventStore from "@/lib/store/event";
import { Article, ArticleCategory } from "@order-app/types";
import { Loader2Icon } from "lucide-react";
import Category from "./Category";

export default function ArticlesList() {
  const event = useEventStore((state) => state.event);

  const articles = event?.articles.filter((a) => !a.archived) ?? [];
  const sortedArticles: {
    [key: string]: { category: ArticleCategory; articles: Article[] };
  } = Object.fromEntries(
    event?.articleCategories
      .filter((c) => !c.archived)
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
    <div className="space-y-8">
      {Object.keys(sortedArticles).map((category) => (
        <Category {...sortedArticles[category]} key={category} />
      ))}
    </div>
  );
}
