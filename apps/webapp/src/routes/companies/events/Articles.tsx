import ArticleForm from "@/components/articles/ArticleForm";
import ArticlesList from "@/components/articles/ArticlesList";
import OutputCategoriesList from "@/components/articles/OutputCategoriesList";
import useEventStore from "@/lib/store/event";
import { Button } from "@order-app/ui";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export default function Articles() {
  const event = useEventStore((state) => state.event);
  const [openAddDialog, setOpenAddDialog] = useState(false);

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between">
          <h2 className="h1">Artikel</h2>
          <Button
            className="flex gap-1"
            size="sm"
            disabled={!event}
            onClick={() => setOpenAddDialog(true)}
          >
            Artikel
            <PlusIcon className="h-5" strokeWidth={2.25} />
          </Button>
        </div>
        <OutputCategoriesList />
        <ArticlesList />
      </div>
      <ArticleForm open={openAddDialog} onOpenChange={setOpenAddDialog} />
    </>
  );
}
