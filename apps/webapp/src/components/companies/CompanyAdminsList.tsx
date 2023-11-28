import { Collection } from "@/lib/collections";
import { db, functions } from "@/lib/firebase";
import { appUserConverter } from "@/lib/model/users";
import useAuthStore from "@/lib/store/auth";
import useCompanyStore from "@/lib/store/company";
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

export default function CompanyAdminsList() {
  const user = useAuthStore((state) => state.user);
  const companyAdmins = useCompanyStore((state) => state.admins);
  const [busy, setBusy] = useState(false);

  function handleRemoveCompanyAdmin(userId: string) {
    return async () => {
      try {
        setBusy(true);
        await httpsCallable(
          functions,
          "assignUserToCompany"
        )({ userId, level: UserLevel.User, company: null }).catch(() => {
          alert("Ein Fehler ist aufgetreten!");
        });
        await updateDoc(
          doc(db, Collection.Users, userId).withConverter(appUserConverter),
          { level: UserLevel.User, company: null }
        );
      } finally {
        setBusy(false);
      }
    };
  }

  return (
    <TableView>
      {companyAdmins?.map((admin) => (
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
                  onClick={handleRemoveCompanyAdmin(admin.id)}
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
