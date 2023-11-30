import { getDisplayColor } from "@/lib/articles";
import { Collection } from "@/lib/collections";
import { db } from "@/lib/firebase";
import { eventConverter } from "@/lib/model/companies";
import { EVENT_QUERY } from "@/lib/queries";
import useEventStore from "@/lib/store/event";
import { Article } from "@order-app/types";
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
  CopyIcon,
  MoreVerticalIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import AddArticleForm from "./AddArticleForm";
import ArticleConfirmActionDialog from "./ArticleConfirmActionDialog";

export default function ArticlesListItem({ article }: { article: Article }) {
  const event = useEventStore((state) => state.event);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [busy, setBusy] = useState(false);
  const queryClient = useQueryClient();

  const updateArticleMutation = useMutation({
    mutationFn: async (updated: Article) => {
      const batch = writeBatch(db);
      const eventRef = doc(db, Collection.Events, event!.id).withConverter(
        eventConverter
      );
      batch.update(eventRef, { articles: arrayRemove(article) });
      batch.update(eventRef, { articles: arrayUnion(updated) });
      await batch.commit();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EVENT_QUERY, event?.id] });
    },
  });

  async function handleRemove() {
    try {
      setBusy(true);
      await updateArticleMutation.mutateAsync({ ...article, archived: true });
    } finally {
      setBusy(false);
    }
  }

  async function handleToggleEnabled() {
    try {
      setBusy(true);
      await updateArticleMutation.mutateAsync({
        ...article,
        enabled: !article.enabled,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2 py-1">
        <p
          className={cn(
            "flex-grow whitespace-nowrap",
            !article.enabled && "text-muted-foreground"
          )}
        >
          {article.displayName}
        </p>
        {!article.enabled && <CircleSlashIcon className="w-5" />}
        {article.customColor && (
          <div
            className={cn(
              "h-5 w-5 rounded border border-black/20",
              getDisplayColor(article.customColor)
            )}
          />
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="left">
            <DropdownMenuItem
              onClick={() => setOpenAddDialog(true)}
              className="cursor-pointer"
            >
              <CopyIcon className="mr-2 h-4 w-4" />
              Kopieren
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleToggleEnabled}
            >
              {article.enabled ? (
                <CircleSlashIcon className="mr-2 h-4 w-4" />
              ) : (
                <CheckCircle2 className="mr-2 h-4 w-4" />
              )}
              {article.enabled ? "Ausverkauft" : "Verfügbar"}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setOpenRemoveDialog(true)}
            >
              <Trash2Icon className="mr-2 h-4 w-4" />
              Entfernen
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AddArticleForm
        open={openAddDialog}
        onOpenChange={setOpenAddDialog}
        copyFrom={article}
      />
      <ArticleConfirmActionDialog
        open={openRemoveDialog}
        onOpenChange={setOpenRemoveDialog}
        heading="Artikel entfernen?"
        confirmText="Entfernen"
        onConfirm={handleRemove}
        busy={busy}
      >
        Bist du dir sicher, dass du <b>{article.displayName}</b> entfernen
        möchtest?
      </ArticleConfirmActionDialog>
    </>
  );
}
