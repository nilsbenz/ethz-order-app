import { Event } from "@order-app/types";
import { doc, getDoc } from "firebase/firestore";
import { useQuery } from "react-query";
import { Collection } from "../collections";
import { db } from "../firebase";
import { eventConverter } from "../model/companies";
import { EVENT_QUERY } from "../queries";
import useAuthStore from "../store/auth";

export default function useEvent({
  eventId,
  callback,
}: {
  eventId?: string;
  callback?: (event: Event | undefined) => void;
}) {
  const userData = useAuthStore((state) => state.userData);

  const event = eventId ?? userData?.event;

  const queryResult = useQuery({
    queryKey: [EVENT_QUERY, event],
    queryFn: async () => {
      if (event) {
        const res = await getDoc(
          doc(db, Collection.Events, event).withConverter(eventConverter)
        );
        return res.data();
      }
    },
    onSettled: (data) => callback?.(data),
  });

  return queryResult;
}
