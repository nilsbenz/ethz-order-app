import { generateId } from "@/lib/articles";
import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { eventConverter } from "@/lib/model/companies";
import { EVENT_QUERY } from "@/lib/queries";
import useEventStore from "@/lib/store/event";
import { zodResolver } from "@hookform/resolvers/zod";
import { OutputCategory } from "@order-app/types";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Form,
  FormField,
  FormItem,
  FormLabel,
  Input,
} from "@order-app/ui";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as z from "zod";

const FormSchema = z.object({
  displayName: z.string().min(2),
});

export default function OutputCategoriesList() {
  const event = useEventStore((state) => state.event);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });
  const [formState, setFormState] = useState<"idle" | "busy">("idle");

  const updateCategoryMutation = useMutation({
    mutationFn: async (updated: OutputCategory) => {
      await updateDoc(
        doc(db, Collection.Events, event!.id).withConverter(eventConverter),
        {
          outputCategories: arrayUnion(updated),
        }
      );
    },
    onSuccess: handleMutationSuccess,
  });

  function handleMutationSuccess() {
    queryClient.invalidateQueries({ queryKey: [EVENT_QUERY, event?.id] });
    setOpenAddDialog(false);
    form.reset();
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setFormState("busy");
      if (!event) {
        return;
      }
      await updateCategoryMutation.mutateAsync({
        id: generateId(event.outputCategories),
        displayName: data.displayName,
      });
    } finally {
      setFormState("idle");
    }
  }

  if (!event) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="h2">Output Kategorien</h3>
        <Button
          className="flex gap-1"
          size="sm"
          variant="outline"
          disabled={!event}
          onClick={() => setOpenAddDialog(true)}
        >
          Neu
          <PlusIcon className="h-5" strokeWidth={2.25} />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 pb-4">
        {event.outputCategories.map((cat) => (
          <p
            key={cat.id}
            className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-card-foreground transition-colors"
          >
            {cat.displayName}
          </p>
        ))}
      </div>
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent>
          <DialogHeader>Output Kategorie hinzufügen</DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="displayName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="displayName">Anzeigename</FormLabel>
                    <Input
                      id="displayName"
                      onChange={field.onChange}
                      defaultValue={field.value}
                    />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost" onClick={() => form.reset()}>
                    Abbrechen
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={formState === "busy"}>
                  Speichern
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
