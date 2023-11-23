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
  Input,
  Label,
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
import { FormEvent, useEffect, useRef, useState } from "react";

export default function Admin() {
  const user = useAuthStore((state) => state.user);
  const [superAdmins, setSuperAdmins] = useState<AppUser[]>();
  const newSuperAdminInput = useRef<HTMLInputElement>(null);
  const [newSuperAdminInputState, setNewSuperAdminInputState] = useState<
    "idle" | "busy"
  >("idle");

  async function handleAddSuperAdmin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setNewSuperAdminInputState("busy");
      const userId = newSuperAdminInput.current?.value;
      if (!userId) {
        throw "no userid provided";
      }
      await updateDoc(
        doc(db, Collection.Users, userId).withConverter(appUserConverter),
        { level: UserLevel.SuperAdmin }
      );
      await httpsCallable(
        functions,
        "updateSuperAdminStatus"
      )({
        userId,
        isSuperAdmin: true,
      });
      newSuperAdminInput.current!.value = "";
    } catch (e) {
      console.log(e);
    } finally {
      setNewSuperAdminInputState("idle");
    }
  }

  function handleRemoveSuperAdmin(userId: string) {
    return async () => {
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
    <div className="flex flex-col gap-4">
      <h2 className="h1">Admin</h2>

      <h3 className="h2">Super Admins</h3>
      <div className="flex flex-col divide-y">
        {superAdmins?.map((admin) => (
          <div key={admin.id} className="flex items-center gap-2 py-1">
            <p className="flex-grow font-medium">{admin.displayName}</p>
            <span className="hidden font-normal text-muted-foreground sm:inline">
              {admin.id}
            </span>
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
                  Bist du dir sicher, dass du {admin.displayName} entfernen
                  möchtest?
                </DialogDescription>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant="ghost"
                      disabled={newSuperAdminInputState === "busy"}
                    >
                      Abbrechen
                    </Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={handleRemoveSuperAdmin(admin.id)}
                    disabled={newSuperAdminInputState === "busy"}
                  >
                    Entfernen
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
      <form
        className="flex flex-col gap-4 sm:flex-row"
        onSubmit={handleAddSuperAdmin}
      >
        <div className="flex-grow">
          <Label htmlFor="displayNameInput">Neuer Super Admin</Label>
          <Input
            id="displayNameInput"
            ref={newSuperAdminInput}
            className="w-full"
            disabled={newSuperAdminInputState === "busy"}
          />
        </div>
        <Button
          type="submit"
          className="self-end"
          disabled={newSuperAdminInputState === "busy"}
        >
          Hinzufügen
        </Button>
      </form>
    </div>
  );
}
