import { colorOptions } from "@/lib/articles";
import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { eventConverter } from "@/lib/model/companies";
import { EVENT_QUERY } from "@/lib/queries";
import useEventStore from "@/lib/store/event";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArticleCategory, ArticleColor } from "@order-app/types";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@order-app/ui";
import { arrayRemove, arrayUnion, doc, writeBatch } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as z from "zod";

const FormSchema = z.object({
  displayName: z.string().min(2),
  color: z.string(),
  output: z.string(),
});

export default function EditCategory({
  category,
  open,
  onOpenChange,
}: {
  category: ArticleCategory;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const event = useEventStore((state) => state.event);
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      displayName: category.displayName,
      color: category.color,
      output: category.output,
    },
  });
  const [formState, setFormState] = useState<"idle" | "busy">("idle");

  const updateCategoryMutation = useMutation({
    mutationFn: async (updated: ArticleCategory) => {
      const eventRef = doc(db, Collection.Events, event!.id).withConverter(
        eventConverter
      );
      const batch = writeBatch(db);
      batch.update(eventRef, {
        articleCategories: arrayRemove(category),
      });
      batch.update(eventRef, {
        articleCategories: arrayUnion(updated),
      });
      await batch.commit();
    },
    onSuccess: handleMutationSuccess,
  });

  function handleMutationSuccess() {
    queryClient.invalidateQueries({ queryKey: [EVENT_QUERY, event?.id] });
    onOpenChange(false);
    form.reset();
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setFormState("busy");
      await updateCategoryMutation.mutateAsync({
        ...category,
        displayName: data.displayName,
        color: data.color as ArticleColor,
        output: data.output,
      });
    } finally {
      setFormState("idle");
    }
  }

  useEffect(() => {
    if (open) {
      form.setValue("displayName", category.displayName);
      form.setValue("color", category.color);
      form.setValue("output", category.output);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <p>
            Kategorie <b>{category.displayName}</b> bearbeiten
          </p>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-2 gap-4"
          >
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel htmlFor="displayName">Anzeigename</FormLabel>
                  <Input
                    id="displayName"
                    onChange={field.onChange}
                    defaultValue={field.value}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="color">Farbe</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id="color">
                      <SelectValue placeholder="Farbe wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(colorOptions).map((color) => (
                        <SelectItem key={color} value={color}>
                          {colorOptions[color as keyof typeof colorOptions]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="output"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="output">Output Kategorie</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id="output">
                      <SelectValue placeholder="Output wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {event?.outputCategories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.displayName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <DialogFooter className="col-span-2">
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
  );
}
