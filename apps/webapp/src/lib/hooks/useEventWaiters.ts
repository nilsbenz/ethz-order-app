import { AppUser, UserLevel } from "@order-app/types";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Collection } from "../collections";
import { db } from "../firebase";
import { appUserConverter } from "../model/users";
import useAuthStore from "../store/auth";

export default function useEventWaiters({
  eventId,
  callback,
}: {
  eventId?: string;
  callback?: (admins: AppUser[]) => void;
}) {
  const userData = useAuthStore((state) => state.userData);
  const [waiters, setWaiters] = useState<AppUser[]>();

  useEffect(() => {
    if (userData?.id && eventId) {
      const waitersQuery = query(
        collection(db, Collection.Users),
        where("level", "==", UserLevel.Waiter),
        where("event", "==", eventId)
      ).withConverter(appUserConverter);
      const unsubscribe = onSnapshot(waitersQuery, (snapshot) => {
        const waiters = snapshot.docs.map((d) => d.data());
        setWaiters(waiters);
        callback?.(waiters);
      });
      return unsubscribe;
    }
  }, [userData?.id, eventId, callback]);

  return waiters;
}
