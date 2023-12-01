import { getDisplayColor } from "@/lib/articles";
import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { eventConverter } from "@/lib/model/companies";
import { EVENT_QUERY } from "@/lib/queries";
import useEventStore from "@/lib/store/event";
import { Article, ArticleCategory } from "@order-app/types";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  cn,
} from "@order-app/ui";
import { arrayRemove, arrayUnion, doc, writeBatch } from "firebase/firestore";
import {
  CheckCircle2,
  CircleSlashIcon,
  MoreVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import TableView from "../lists/TableView";
import ArticleConfirmActionDialog from "./ArticleConfirmActionDialog";
import ArticlesListItem from "./ArticlesListItem";
import EditCategory from "./EditCategory";

export default function Category({
  category,
  articles,
}: {
  category: ArticleCategory;
  articles: Article[];
}) {
  const event = useEventStore((state) => state.event);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [busy, setBusy] = useState(false);
  const queryClient = useQueryClient();

  const updateCategoryMutation = useMutation({
    mutationFn: async (updated?: ArticleCategory) => {
      const batch = writeBatch(db);
      const eventRef = doc(db, Collection.Events, event!.id).withConverter(
        eventConverter
      );
      batch.update(eventRef, { articleCategories: arrayRemove(category) });
      if (updated) {
        batch.update(eventRef, { articleCategories: arrayUnion(updated) });
      }
      await batch.commit();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENT_QUERY, event?.id] });
    },
  });

  async function handleRemove() {
    try {
      setBusy(true);
      await updateCategoryMutation.mutateAsync(undefined);
      setOpenRemoveDialog(false);
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleEnabled() {
    try {
      setBusy(true);
      await updateCategoryMutation.mutateAsync({
        ...category,
        enabled: !category.enabled,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3
            className={cn(
              "h2 flex flex-grow items-center gap-2",
              !category.enabled && "text-muted-foreground"
            )}
          >
            <div
              className={cn(
                "h-5 w-5 rounded border border-black/20",
                getDisplayColor(category.color),
                !category.enabled && "opacity-60"
              )}
            />
            {category.displayName}
          </h3>
          {!category.enabled && (
            <CircleSlashIcon strokeWidth={2.5} className="text-destructive" />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="left">
              <DropdownMenuItem
                onClick={() => setOpenEditDialog(true)}
                className="cursor-pointer"
              >
                <PencilIcon className="mr-2 h-4 w-4" />
                Bearbeiten
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={handleToggleEnabled}
              >
                {category.enabled ? (
                  <CircleSlashIcon className="mr-2 h-4 w-4" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                {category.enabled ? "Ausverkauft" : "Verfügbar"}
              </DropdownMenuItem>
              {articles.length === 0 && (
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setOpenRemoveDialog(true)}
                >
                  <Trash2Icon className="mr-2 h-4 w-4" />
                  Entfernen
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <TableView loading={!event}>
          {articles.map((article) => (
            <ArticlesListItem
              key={article.id}
              article={article}
              categoryDisabled={!category.enabled}
            />
          ))}
        </TableView>
      </div>
      <EditCategory
        open={openEditDialog}
        onOpenChange={() => setOpenEditDialog(false)}
        category={category}
      />
      <ArticleConfirmActionDialog
        open={openRemoveDialog}
        onOpenChange={setOpenRemoveDialog}
        heading="Kategorie entfernen?"
        confirmText="Entfernen"
        onConfirm={handleRemove}
        busy={busy}
      >
        Bist du dir sicher, dass du <b>{category.displayName}</b> entfernen
        möchtest?
      </ArticleConfirmActionDialog>
    </>
  );
}
