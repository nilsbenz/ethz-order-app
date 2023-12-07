import { Collection, generateId } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { companyConverter } from "@/lib/model/companies";
import { Company } from "@order-app/types";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  Input,
  Label,
} from "@order-app/ui";
import { doc, setDoc } from "firebase/firestore";
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
      const id = await generateId(Collection.Companies, 6);
      const newCompany: Company = {
        id,
        displayName: companyNameInput.current?.value,
        archived: false,
      };
      await setDoc(
        doc(db, Collection.Companies, id).withConverter(companyConverter),
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
        <DialogHeader>Neuen Verein erstellen</DialogHeader>
        <form onSubmit={handleAddCompany} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="companyDisplayName">Name des Vereins</Label>
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
      </DialogContent>
    </Dialog>
  );
}
