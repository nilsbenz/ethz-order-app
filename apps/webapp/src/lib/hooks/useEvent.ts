import { Event } from "@order-app/types";
import { doc, getDoc } from "firebase/firestore";
import { useQuery } from "react-query";
import { Collection } from "../collections";
import { db } from "../firebase";
import { eventConverter } from "../model/companies";
import { EVENT_QUERY } from "../queries";

export default function useEvent({
  eventId,
  callback,
}: {
  eventId?: string;
  callback?: (event: Event | undefined) => void;
}) {
  const queryResult = useQuery({
    queryKey: [EVENT_QUERY, eventId],
    queryFn: async () => {
      if (eventId) {
        const res = await getDoc(
          doc(db, Collection.Events, eventId).withConverter(eventConverter)
        );
        return res.data();
      }
    },
    onSettled: (data) => callback?.(data),
  });

  return queryResult;
}
