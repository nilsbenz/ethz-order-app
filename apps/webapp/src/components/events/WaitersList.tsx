import { Collection } from "@/lib/collections";
import { db, functions } from "@/lib/firebase";
import { appUserConverter } from "@/lib/model/users";
import useAuthStore from "@/lib/store/auth";
import useEventStore from "@/lib/store/event";
import { UserLevel } from "@order-app/types";
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
import { doc, updateDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import TableView from "../lists/TableView";

export default function WaitersList() {
  const user = useAuthStore((state) => state.user);
  const waiters = useEventStore((state) => state.waiters);
  const [busy, setBusy] = useState(false);

  function handleRemoveWaiter(userId: string) {
    return async () => {
      try {
        setBusy(true);
        await httpsCallable(
          functions,
          "assignUserToEntity"
        )({ userId, level: UserLevel.User, entity: null }).catch(() => {
          alert("Ein Fehler ist aufgetreten!");
        });
        await updateDoc(
          doc(db, Collection.Users, userId).withConverter(appUserConverter),
          { level: UserLevel.User, event: null, validUntil: null }
        );
      } finally {
        setBusy(false);
      }
    };
  }

  return (
    <TableView>
      {waiters?.map((waiter) => (
        <div key={waiter.id} className="flex items-center gap-2 py-1">
          <p className="flex-grow whitespace-nowrap font-medium">
            {waiter.displayName}
          </p>
          <p className="truncate font-normal text-muted-foreground">
            {waiter.id}
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={waiter.id === user?.uid}
              >
                <Trash2Icon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Personal entfernen?</DialogHeader>
              <DialogDescription>
                Bist du dir sicher, dass du <b>{waiter.displayName}</b>{" "}
                entfernen möchtest?
              </DialogDescription>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Abbrechen</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleRemoveWaiter(waiter.id)}
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
