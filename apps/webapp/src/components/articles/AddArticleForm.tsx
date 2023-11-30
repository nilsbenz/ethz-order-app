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
  DialogTrigger,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { FieldValue, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
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

export default function AddArticleForm({ copyFrom }: { copyFrom?: Article }) {
  const [openDialog, setOpenDialog] = useState(false);
  const event = useEventStore((state) => state.event);
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      categoryType: CategoryType.Existing,
      category: copyFrom?.category,
      articleName: copyFrom?.displayName,
      articleColor: copyFrom?.customColor ?? "none",
    },
  });

  const addArticleMutation = useMutation({
    mutationFn: async ({
      article,
      category,
    }: {
      article: Article;
      category?: ArticleCategory;
    }) => {
      const categoryUpdate: Partial<{
        [key in keyof Event]: FieldValue;
      }> = category ? { articleCategories: arrayUnion(category) } : {};
      await updateDoc(
        doc(db, Collection.Events, event!.id).withConverter(eventConverter),
        {
          articles: arrayUnion(article),
          ...categoryUpdate,
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENT_QUERY, event?.id] });
      setOpenDialog(false);
      form.reset();
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
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
    const articleAlreadyExists = !!event?.articles.find(
      (a) => a.displayName.toLowerCase() === data.articleName?.toLowerCase()
    );
    if (articleAlreadyExists) {
      form.setError("newCategoryName", {
        message: "Diese Kategorie existiert bereits.",
      });
      hasErrors = true;
    }
    if (hasErrors) {
      return;
    }
    const newCategoryId = generateId(event!.articleCategories);
    const category =
      data.categoryType === CategoryType.Existing
        ? data.category
        : newCategoryId;
    addArticleMutation.mutate({
      article: {
        id: generateId(event!.articles),
        displayName: data.articleName,
        category,
        customColor:
          data.articleColor === USE_CATEGORY_COLOR
            ? null
            : (data.articleColor as ArticleColor),
      },
      category:
        data.categoryType === CategoryType.New
          ? {
              id: newCategoryId,
              displayName: data.newCategoryName,
              color: data.newCategoryColor as ArticleColor,
            }
          : undefined,
    });
  }

  useEffect(() => {
    if (openDialog) {
      if (!event || event.articleCategories.length === 0) {
        form.setValue("categoryType", CategoryType.New);
      }
    }
  }, [openDialog]);

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button className="flex gap-1" size="sm" disabled={!event}>
          Neu
          <PlusIcon className="h-5" strokeWidth={2.25} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Neuen Artikel erfassen</DialogHeader>
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
                    onChange={field.onChange}
                    defaultValue={field.value}
                  />
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
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Abbrechen</Button>
              </DialogClose>
              <Button type="submit">Speichern</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
