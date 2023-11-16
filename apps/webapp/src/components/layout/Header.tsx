import { cn } from "@order-app/ui";
import { CloudIcon } from "lucide-react";

function Header() {
  const safeAreaHeight = `max(0px, calc(env(safe-area-inset-top, 0.5rem) - 0.5rem))`;
  const headerHeight = "h-14";

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-30 border-b border-border/50 bg-muted/80 px-4 backdrop-blur"
        style={{
          paddingTop: safeAreaHeight,
        }}
      >
        <div className={cn("flex items-center gap-2", headerHeight)}>
          <CloudIcon className="h-8 w-8" strokeWidth={2.25} />
          <h1 className="text-xl font-medium">bstell.online</h1>
        </div>
      </header>
      <div
        className={cn("w-full", headerHeight)}
        style={{
          marginTop: safeAreaHeight,
        }}
      />
    </>
  );
}

export default Header;
