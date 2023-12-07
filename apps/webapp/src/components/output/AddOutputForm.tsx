import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { eventConverter } from "@/lib/model/companies";
import { EVENT_QUERY } from "@/lib/queries";
import useEventStore from "@/lib/store/event";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrinterOutput } from "@order-app/types";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Form,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@order-app/ui";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { ChevronDownIcon, PlusIcon } from "lucide-react";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { toast } from "sonner";
import * as z from "zod";

const OutputType = {
  Printer: "printer",
  Display: "display",
} as const;
type OutputType = (typeof OutputType)[keyof typeof OutputType];

const FormSchema = z.union([
  z.object({
    outputType: z.literal(OutputType.Printer),
    displayName: z.string(),
    printer: z.string().ip({ version: "v4" }),
    outputCategories: z.array(z.string()).min(1),
  }),
  z.object({
    outputType: z.literal(OutputType.Display),
    displayName: z.string(),
  }),
]);

export default function AddOutputForm() {
  const event = useEventStore((state) => state.event);
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      outputType: OutputType.Printer,
      printer: "192.168.1.192",
      outputCategories: [],
    },
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "busy">("idle");

  const printerMutation = useMutation({
    mutationFn: async (output: PrinterOutput) => {
      await updateDoc(
        doc(db, Collection.Events, event!.id).withConverter(eventConverter),
        {
          printers: arrayUnion(output),
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENT_QUERY, event?.id] });
      setOpenDialog(false);
      form.reset();
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.outputType === OutputType.Printer) {
      try {
        setFormStatus("busy");
        await printerMutation.mutateAsync({
          id: nanoid(),
          displayName: data.displayName,
          printer: data.printer,
          outputCategories: data.outputCategories,
        });
      } finally {
        setFormStatus("busy");
      }
    } else {
      toast("Dieser Output wird noch nicht unterstützt.");
    }
  }

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Output
          <PlusIcon className="ml-2 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Output hinzufügen</DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="outputType"
              render={({ field: tabsField }) => (
                <Tabs
                  defaultValue={tabsField.value}
                  onValueChange={tabsField.onChange}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value={OutputType.Printer}
                      disabled={!event || event.articleCategories.length === 0}
                    >
                      Drucker
                    </TabsTrigger>
                    <TabsTrigger value={OutputType.Display} disabled>
                      Display
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent
                    value={OutputType.Printer}
                    className="flex flex-col gap-4"
                  >
                    <FormField
                      control={form.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="displayName">
                            Anzeigename
                          </FormLabel>
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
                      name="printer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="printer">
                            IP-Adresse des Druckers
                          </FormLabel>
                          <Input
                            id="printer"
                            onChange={field.onChange}
                            defaultValue={field.value}
                          />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="outputCategories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="categories">Kategorien</FormLabel>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                id="categories"
                                className="relative block h-auto min-h-[2.5rem] w-full text-start"
                              >
                                {field.value.length > 0
                                  ? field.value
                                      .map(
                                        (v) =>
                                          event?.outputCategories.find(
                                            (c) => c.id === v
                                          )?.displayName ?? "Unbekannt"
                                      )
                                      .sort()
                                      .join(", ")
                                  : "Kategorien wählen"}
                                <div className="absolute bottom-0 right-0 top-0 grid w-10 place-items-center rounded-md">
                                  <ChevronDownIcon />
                                </div>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-72">
                              {event?.outputCategories
                                .sort((a, b) =>
                                  a.displayName < b.displayName ? -1 : 1
                                )
                                .map((cat) => (
                                  <DropdownMenuCheckboxItem
                                    key={cat.id}
                                    checked={field.value.includes(cat.id)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([
                                          ...field.value,
                                          cat.id,
                                        ]);
                                      } else {
                                        field.onChange(
                                          field.value.filter(
                                            (v) => v !== cat.id
                                          )
                                        );
                                      }
                                    }}
                                  >
                                    {cat.displayName}
                                  </DropdownMenuCheckboxItem>
                                ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value={OutputType.Display}>Display</TabsContent>
                </Tabs>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost" onClick={() => form.reset()}>
                  Abbrechen
                </Button>
              </DialogClose>
              <Button type="submit" disabled={formStatus === "busy"}>
                Speichern
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
