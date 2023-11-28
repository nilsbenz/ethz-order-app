import { Collection, generateId } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { eventConverter } from "@/lib/model/companies";
import useCompanyStore from "@/lib/store/company";
import { Event } from "@order-app/types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  Input,
  Label,
} from "@order-app/ui";
import { DialogClose } from "@order-app/ui/src/components/dialog";
import { doc, setDoc } from "firebase/firestore";
import { PlusIcon } from "lucide-react";
import { FormEvent, useRef, useState } from "react";

export default function NewEventForm() {
  const company = useCompanyStore((state) => state.company);
  const [openDialog, setOpenDialog] = useState(false);
  const [formState, setFormState] = useState<"idle" | "busy">("idle");
  const displayNameInput = useRef<HTMLInputElement>(null);

  async function handleAddEvent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setFormState("busy");
      const displayName = displayNameInput.current?.value;
      if (!displayName) {
        throw "no displayname provided";
      }
      const id = await generateId(Collection.Events, 8);
      const newEvent: Event = {
        id,
        companyId: company?.id ?? "",
        displayName,
        waiters: [],
        articleCategories: [],
        articles: [],
        tables: {
          rowCount: 4,
          colCount: 4,
          tables: {},
        },
        archived: false,
      };
      await setDoc(
        doc(db, Collection.Events, id).withConverter(eventConverter),
        newEvent
      );
      displayNameInput.current.value = "";
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
        <DialogHeader>Event hinzufügen</DialogHeader>
        <form onSubmit={handleAddEvent} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="eventDisplayName">Name des Events</Label>
            <Input
              id="eventDisplayName"
              ref={displayNameInput}
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
