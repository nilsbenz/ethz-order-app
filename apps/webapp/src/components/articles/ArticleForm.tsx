import { generateId } from "@/lib/articles";
import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { eventConverter } from "@/lib/model/companies";
import { EVENT_QUERY } from "@/lib/queries";
import useEventStore from "@/lib/store/event";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Article,
  ArticleCategory,
  ArticleColor,
  Event,
} from "@order-app/types";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@order-app/ui";
import {
  FieldValue,
  arrayRemove,
  arrayUnion,
  doc,
  writeBatch,
} from "firebase/firestore";
import { InfoIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { useDebounce } from "usehooks-ts";
import * as z from "zod";

const CategoryType = {
  Existing: "existing",
  New: "new",
} as const;
type CategoryType = (typeof CategoryType)[keyof typeof CategoryType];

const USE_CATEGORY_COLOR = "none";

const FormSchema = z.union([
  z.object({
    categoryType: z.literal(CategoryType.Existing),
    category: z.string(),
    articleName: z.string(),
    articleColor: z.string(),
  }),
  z.object({
    categoryType: z.literal(CategoryType.New),
    newCategoryName: z.string(),
    newCategoryColor: z.string(),
    articleName: z.string(),
    articleColor: z.string(),
  }),
]);

const colorOptions: { [key in ArticleColor]: string } = {
  [ArticleColor.White]: "Weiss",
  [ArticleColor.Red]: "Rot",
  [ArticleColor.Orange]: "Orange",
  [ArticleColor.Yellow]: "Gelb",
  [ArticleColor.Green]: "Grün",
  [ArticleColor.Blue]: "Blau",
  [ArticleColor.Purple]: "Violett",
} as const;

export default function ArticleForm({
  open,
  onOpenChange,
  edit,
  copyFrom,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  edit?: Article;
  copyFrom?: Article;
}) {
  const event = useEventStore((state) => state.event);
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      categoryType: CategoryType.Existing,
      category: edit?.category ?? copyFrom?.category,
      articleName: edit?.displayName ?? copyFrom?.displayName,
      articleColor: edit?.customColor ?? copyFrom?.customColor ?? "none",
    },
  });
  const [formStatus, setFormStatus] = useState<"idle" | "busy">("idle");
  const [articleName, setArticleName] = useState(
    edit?.displayName ?? copyFrom?.displayName ?? ""
  );
  const debouncedArticleName = useDebounce(articleName, 200);
  const [enableArchived, setEnableArchived] = useState<Article>();

  const addArticleMutation = useMutation({
    mutationFn: async ({
      addArticle,
      removeArticle,
      addCategory,
    }: {
      addArticle: Article;
      removeArticle?: Article;
      addCategory?: ArticleCategory;
    }) => {
      const categoryUpdate: Partial<{
        [key in keyof Event]: FieldValue;
      }> = addCategory ? { articleCategories: arrayUnion(addCategory) } : {};
      const eventRef = doc(db, Collection.Events, event!.id).withConverter(
        eventConverter
      );
      const batch = writeBatch(db);
      if (removeArticle) {
        batch.update(eventRef, {
          articles: arrayRemove(removeArticle),
        });
      }
      batch.update(eventRef, {
        articles: arrayUnion(addArticle),
        ...categoryUpdate,
      });
      await batch.commit();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENT_QUERY, event?.id] });
      onOpenChange(false);
      form.reset();
      setArticleName(edit?.displayName ?? copyFrom?.displayName ?? "");
    },
    onError: (e) => console.log(e),
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setFormStatus("busy");
      let hasErrors = false;
      if (data.categoryType === CategoryType.New) {
        const newCategoryAlreadyExists = !!event?.articleCategories.find(
          (c) =>
            c.displayName.toLowerCase() === data.newCategoryName?.toLowerCase()
        );
        if (newCategoryAlreadyExists) {
          form.setError("newCategoryName", {
            message: "Diese Kategorie existiert bereits.",
          });
          hasErrors = true;
        }
      }
      if (!edit) {
        const articleAlreadyExists = !!event?.articles
          .filter((a) => !a.archived)
          .find(
            (a) =>
              a.displayName.toLowerCase() === data.articleName?.toLowerCase()
          );
        if (articleAlreadyExists) {
          form.setError("articleName", {
            message: "Dieser Artikel existiert bereits.",
          });
          hasErrors = true;
        }
      }
      if (hasErrors) {
        return;
      }
      const newCategoryId = generateId(event!.articleCategories);
      const category =
        data.categoryType === CategoryType.Existing
          ? data.category
          : newCategoryId;
      await addArticleMutation.mutateAsync({
        addArticle: {
          id: generateId(event!.articles),
          displayName: data.articleName,
          category,
          customColor:
            data.articleColor === USE_CATEGORY_COLOR
              ? null
              : (data.articleColor as ArticleColor),
          enabled: edit?.enabled ?? true,
          archived: edit?.archived ?? false,
        },
        removeArticle: enableArchived ?? edit,
        addCategory:
          data.categoryType === CategoryType.New
            ? {
                id: newCategoryId,
                displayName: data.newCategoryName,
                color: data.newCategoryColor as ArticleColor,
                enabled: true,
                archived: false,
              }
            : undefined,
      });
    } finally {
      setFormStatus("idle");
    }
  }

  useEffect(() => {
    setEnableArchived(
      event?.articles
        .filter((a) => a.archived)
        .find(
          (a) =>
            a.displayName.toLowerCase() === debouncedArticleName.toLowerCase()
        )
    );
  }, [debouncedArticleName]);

  useEffect(() => {
    if (open) {
      if (!event || event.articleCategories.length === 0) {
        form.setValue("categoryType", CategoryType.New);
      }
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          {edit ? `${edit.displayName} bearbeiten` : "Neuen Artikel erfassen"}
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="categoryType"
              render={({ field: tabsField }) => (
                <Tabs
                  defaultValue={tabsField.value}
                  onValueChange={tabsField.onChange}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value={CategoryType.Existing}
                      disabled={!event || event.articleCategories.length === 0}
                    >
                      Kategorie wählen
                    </TabsTrigger>
                    <TabsTrigger value={CategoryType.New}>
                      Neue Kategorie
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value={CategoryType.Existing}>
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="category">Kategorie</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger id="category">
                                <SelectValue placeholder="Kategorie wählen" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {event?.articleCategories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.displayName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent
                    value={CategoryType.New}
                    className="grid grid-cols-2 gap-4"
                  >
                    <FormField
                      control={form.control}
                      name="newCategoryName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="newCategoryName">
                            Name der Kategorie
                          </FormLabel>
                          <Input
                            id="newCategoryName"
                            onChange={field.onChange}
                            defaultValue={field.value}
                          />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="newCategoryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="newCategoryColor">
                            Farbe der Kategorie
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger id="newCategoryColor">
                              <SelectValue placeholder="Farbe wählen" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(colorOptions).map((color) => (
                                <SelectItem key={color} value={color}>
                                  {
                                    colorOptions[
                                      color as keyof typeof colorOptions
                                    ]
                                  }
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              )}
            />
            <FormField
              control={form.control}
              name="articleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="articleName">Name des Artikels</FormLabel>
                  <Input
                    id="articleName"
                    onChange={(e) => {
                      field.onChange(e);
                      setArticleName(e.currentTarget.value);
                    }}
                    defaultValue={field.value}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="articleColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="articleColor">
                    Farbe des Artikels
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id="articleColor">
                      <SelectValue placeholder="Farbe wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={USE_CATEGORY_COLOR}>
                        Wie Kategorie
                      </SelectItem>
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
            {enableArchived && (
              <p className="flex items-center gap-2">
                <InfoIcon className="h-4 w-4" /> Dieser Artikel existiert
                bereits und wird wieder aktiviert.
              </p>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Abbrechen</Button>
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
