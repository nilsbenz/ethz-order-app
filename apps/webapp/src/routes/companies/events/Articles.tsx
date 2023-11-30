import AddArticleForm from "@/components/articles/AddArticleForm";
import ArticlesList from "@/components/articles/ArticlesList";

export default function Articles() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between">
        <h2 className="h1">Artikel</h2>
        <AddArticleForm />
      </div>
      <ArticlesList />
    </div>
  );
}
