import { Collection } from "@/lib/collections";
import { db, functions } from "@/lib/firebase";
import { appUserConverter } from "@/lib/model/users";
import { UserLevel } from "@order-app/types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  Input,
} from "@order-app/ui";
import { DialogClose } from "@order-app/ui/src/components/dialog";
import { doc, updateDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { PlusIcon } from "lucide-react";
import { FormEvent, useRef, useState } from "react";

export default function NewSuperAdminForm() {
  const newSuperAdminInput = useRef<HTMLInputElement>(null);
  const [newSuperAdminInputState, setNewSuperAdminInputState] = useState<
    "idle" | "busy"
  >("idle");
  const [openDialog, setOpenDialog] = useState(false);

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
      setOpenDialog(false);
    } catch (e) {
      console.log(e);
    } finally {
      setNewSuperAdminInputState("idle");
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="flex gap-1" size="sm">
          Neu
          <PlusIcon className="h-5" strokeWidth={2.25} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Super Admin hinzufügen</DialogHeader>
        <DialogDescription>
          <form onSubmit={handleAddSuperAdmin} className="flex flex-col gap-4">
            <Input
              ref={newSuperAdminInput}
              className="w-full"
              disabled={newSuperAdminInputState === "busy"}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Abbrechen</Button>
              </DialogClose>
              <Button
                type="submit"
                disabled={newSuperAdminInputState === "busy"}
              >
                Hinzufügen
              </Button>
            </DialogFooter>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
