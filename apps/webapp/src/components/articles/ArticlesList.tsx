import useEventStore from "@/lib/store/event";
import TableView from "../lists/TableView";

export default function ArticlesList() {
  const event = useEventStore((state) => state.event);

  return (
    <TableView loading={!event}>
      {event?.articles.map((article) => (
        <div key={article.id} className="flex items-center gap-2 py-1">
          <p className="flex-grow whitespace-nowrap">{article.displayName}</p>
        </div>
      ))}
    </TableView>
  );
}
