import { Collection } from "@/lib/collections";
import { db, functions } from "@/lib/firebase";
import { appUserConverter } from "@/lib/model/users";
import useCompanyStore from "@/lib/store/company";
import { AppUser, UserLevel } from "@order-app/types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@order-app/ui";
import { DialogClose } from "@order-app/ui/src/components/dialog";
import { doc, updateDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { PlusIcon } from "lucide-react";
import { FormEvent, useState } from "react";
import FindUser from "../users/FindUser";

export default function NewCompanyAdminForm() {
  const company = useCompanyStore((state) => state.company);
  const [newCompanyAdminInputState, setNewCompanyAdminInputState] = useState<
    "idle" | "busy"
  >("idle");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AppUser>();

  async function handleAddCompanyAdmin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setNewCompanyAdminInputState("busy");
      const userId = selectedUser?.id;
      if (!userId) {
        throw "no userid provided";
      }
      await updateDoc(
        doc(db, Collection.Users, userId).withConverter(appUserConverter),
        { level: UserLevel.Admin, company: company?.id }
      );
      await httpsCallable(
        functions,
        "assignUserToCompany"
      )({
        userId,
        company: company?.id,
        level: UserLevel.Admin,
      });
      setOpenDialog(false);
      setSelectedUser(undefined);
    } catch (e) {
      console.log(e);
    } finally {
      setNewCompanyAdminInputState("idle");
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
        <DialogHeader>Admin hinzufügen</DialogHeader>
        <form onSubmit={handleAddCompanyAdmin} className="flex flex-col gap-4">
          <FindUser value={selectedUser?.id ?? ""} onSelect={setSelectedUser} />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Abbrechen</Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={newCompanyAdminInputState === "busy"}
            >
              Hinzufügen
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
