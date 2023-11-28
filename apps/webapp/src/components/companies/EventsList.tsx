import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { eventConverter } from "@/lib/model/companies";
import { Page } from "@/lib/pages";
import useAuthStore from "@/lib/store/auth";
import { Company, Event } from "@order-app/types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@order-app/ui";
import { DialogClose } from "@order-app/ui/src/components/dialog";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function EventsList({ company }: { company: Company }) {
  const user = useAuthStore((state) => state.user);
  const [events, setEvents] = useState<Event[]>();
  const [busy, setBusy] = useState(false);

  function handleRemoveEvent(eventId: string) {
    return async () => {
      try {
        setBusy(true);
        await updateDoc(
          doc(db, Collection.Events, eventId).withConverter(eventConverter),
          { archived: true }
        );
      } finally {
        setBusy(false);
      }
    };
  }

  useEffect(() => {
    const eventsQuery = query(
      collection(db, Collection.Events),
      where("companyId", "==", company.id),
      where("archived", "==", false)
    ).withConverter(eventConverter);
    const unsubscribe = onSnapshot(eventsQuery, (snapshot) =>
      setEvents(snapshot.docs.map((d) => d.data()))
    );
    return unsubscribe;
  }, [user?.uid, company.id]);

  return (
    <div className="flex flex-col divide-y">
      {events?.map((event) => (
        <div key={event.id} className="flex items-center gap-2 py-1">
          <p className="flex-grow whitespace-nowrap font-medium">
            <Link
              to={`${Page.Events}/${event.id}`}
              className="-mx-1 p-1 text-inherit"
            >
              {event.displayName}
            </Link>
          </p>
          <p className="truncate font-normal text-muted-foreground">
            {event.id}
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={event.id === user?.uid}
              >
                <Trash2Icon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Event löschen?</DialogHeader>
              <DialogDescription>
                Bist du dir sicher, dass du <b>{event.displayName}</b> entfernen
                möchtest? Dies kann nicht rückgängig gemacht werden.
              </DialogDescription>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Abbrechen</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleRemoveEvent(event.id)}
                  disabled={busy}
                >
                  Entfernen
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ))}
    </div>
  );
}
