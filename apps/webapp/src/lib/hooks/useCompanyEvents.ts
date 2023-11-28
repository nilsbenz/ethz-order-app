import { Event } from "@order-app/types";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Collection } from "../collections";
import { db } from "../firebase";
import { eventConverter } from "../model/companies";
import useAuthStore from "../store/auth";

export default function useCompanyEvents({
  companyId,
  callback,
}: {
  companyId?: string;
  callback?: (admins: Event[]) => void;
}) {
  const userData = useAuthStore((state) => state.userData);
  const [events, setEvents] = useState<Event[]>();

  const company = companyId ?? userData?.company ?? null;

  useEffect(() => {
    if (userData?.id && company) {
      const eventsQuery = query(
        collection(db, Collection.Events),
        where("companyId", "==", company),
        where("archived", "==", false)
      ).withConverter(eventConverter);
      const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
        const events = snapshot.docs.map((d) => d.data());
        setEvents(events);
        callback?.(events);
      });
      return unsubscribe;
    }
  }, [userData?.id, company, callback]);

  return events;
}
