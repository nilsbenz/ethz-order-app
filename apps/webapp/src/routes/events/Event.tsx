import ActionsListItem from "@/components/events/ActionsListItem";
import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { eventConverter } from "@/lib/model/companies";
import { SubPage } from "@/lib/pages";
import { EVENT_QUERY } from "@/lib/queries";
import { doc, getDoc } from "firebase/firestore";
import { Loader2Icon } from "lucide-react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

const actions = [
  { label: "Artikel bearbeiten", link: SubPage.Articles },
] as const;

export default function Event() {
  const { event: eventId } = useParams();

  const { data: event, status } = useQuery({
    queryKey: [EVENT_QUERY, eventId],
    queryFn: async () => {
      if (eventId) {
        const res = await getDoc(
          doc(db, Collection.Events, eventId).withConverter(eventConverter)
        );
        return res.data();
      }
    },
  });

  if (status === "loading") {
    return (
      <div className="grid min-h-[40vh] place-items-center">
        <Loader2Icon className="animate-spin text-border" />
      </div>
    );
  }

  if (!event) {
    return <>event not found</>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="h1">{event.displayName}</h2>
      <div className="flex flex-col divide-y">
        {actions.map((action, index) => (
          <ActionsListItem key={index} {...action} />
        ))}
      </div>
    </div>
  );
}
