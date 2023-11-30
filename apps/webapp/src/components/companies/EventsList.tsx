import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { eventConverter } from "@/lib/model/companies";
import { Page, SubPage } from "@/lib/pages";
import useCompanyStore from "@/lib/store/company";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@order-app/ui";
import { doc, updateDoc } from "firebase/firestore";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import TableView from "../lists/TableView";

export default function EventsList() {
  const { company, events } = useCompanyStore();
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

  return (
    <TableView loading={!events}>
      {events?.map((event) => (
        <div key={event.id} className="flex items-center gap-2 py-1">
          <p className="flex-grow whitespace-nowrap font-medium">
            <Link
              to={`${Page.Companies}/${company?.id}/${SubPage.Events}/${event.id}`}
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
              <Button variant="ghost" size="icon">
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
    </TableView>
  );
}
