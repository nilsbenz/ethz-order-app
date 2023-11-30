import { CircleSlash2Icon, Loader2Icon } from "lucide-react";

export default function TableView({
  children,
  loading = false,
}: {
  children?: JSX.Element[];
  loading?: boolean;
}) {
  return (
    <div className="-mx-1 flex flex-col divide-y rounded-lg border border-border bg-card px-3 py-1 transition-[background-color] md:-mx-4 md:px-4">
      {loading ? (
        <div className="grid place-items-center py-2.5 text-muted-foreground delay-200 duration-500 animate-in fade-in-0 fill-mode-backwards">
          <Loader2Icon strokeWidth={2.25} className="animate-spin" />
        </div>
      ) : children && children.length > 0 ? (
        children
      ) : (
        <div className="grid place-items-center py-2.5 text-muted-foreground">
          <CircleSlash2Icon strokeWidth={2.25} />
        </div>
      )}
    </div>
  );
}
