import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { companyConverter } from "@/lib/model/companies";
import { Company } from "@order-app/types";
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
import { addDoc, collection } from "firebase/firestore";
import { PlusIcon } from "lucide-react";
import { FormEvent, useRef, useState } from "react";

export default function NewCompanyForm() {
  const [openDialog, setOpenDialog] = useState(false);
  const companyNameInput = useRef<HTMLInputElement>(null);
  const [formState, setFormState] = useState<"idle" | "busy">("idle");

  async function handleAddCompany(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setFormState("busy");
      const displayName = companyNameInput.current?.value;
      if (!displayName) {
        throw "no displayname provided";
      }
      const newCompany: Company = {
        id: "",
        displayName: companyNameInput.current?.value,
        admins: [],
        archived: false,
      };
      await addDoc(
        collection(db, Collection.Companies).withConverter(companyConverter),
        newCompany
      );
      companyNameInput.current.value = "";
      setOpenDialog(false);
    } catch (e) {
      console.log(e);
    } finally {
      setFormState("idle");
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
        <DialogHeader>Neue Company erstellen</DialogHeader>
        <DialogDescription>
          <form onSubmit={handleAddCompany} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="companyDisplayName">Name der Company</Label>
              <Input
                id="companyDisplayName"
                ref={companyNameInput}
                className="w-full"
                disabled={formState === "busy"}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Abbrechen</Button>
              </DialogClose>
              <Button type="submit" disabled={formState === "busy"}>
                Hinzufügen
              </Button>
            </DialogFooter>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
