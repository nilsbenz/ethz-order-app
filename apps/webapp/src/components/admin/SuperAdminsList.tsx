import { Collection } from "@/lib/collections";
import { db, functions } from "@/lib/firebase";
import { appUserConverter } from "@/lib/model/users";
import useAuthStore from "@/lib/store/auth";
import { AppUser, UserLevel } from "@order-app/types";
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
import { httpsCallable } from "firebase/functions";
import { Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";

export default function SuperAdminsList() {
  const user = useAuthStore((state) => state.user);
  const [superAdmins, setSuperAdmins] = useState<AppUser[]>();
  const [busy, setBusy] = useState(false);

  function handleRemoveSuperAdmin(userId: string) {
    return async () => {
      try {
        setBusy(true);
        await httpsCallable(
          functions,
          "updateSuperAdminStatus"
        )({ userId, isSuperAdmin: false }).catch(() => {
          alert("Ein Fehler ist aufgetreten!");
        });
        await updateDoc(
          doc(db, Collection.Users, userId).withConverter(appUserConverter),
          { level: UserLevel.User }
        );
      } finally {
        setBusy(false);
      }
    };
  }

  useEffect(() => {
    const superAdminsQuery = query(
      collection(db, Collection.Users),
      where("level", "==", 9)
    ).withConverter(appUserConverter);
    const unsubscribe = onSnapshot(superAdminsQuery, (snapshot) =>
      setSuperAdmins(snapshot.docs.map((d) => d.data()))
    );
    return unsubscribe;
  }, [user?.uid]);

  return (
    <div className="flex flex-col divide-y">
      {superAdmins?.map((admin) => (
        <div key={admin.id} className="flex items-center gap-2 py-1">
          <p className="flex-grow whitespace-nowrap font-medium">
            {admin.displayName}
          </p>
          <p className="truncate font-normal text-muted-foreground">
            {admin.id}
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={admin.id === user?.uid}
              >
                <Trash2Icon />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Super Admin entfernen?</DialogHeader>
              <DialogDescription>
                Bist du dir sicher, dass du <b>{admin.displayName}</b> entfernen
                möchtest?
              </DialogDescription>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost">Abbrechen</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={handleRemoveSuperAdmin(admin.id)}
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
