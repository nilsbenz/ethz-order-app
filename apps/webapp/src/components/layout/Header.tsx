import { Button, cn } from "@order-app/ui";
import { CloudIcon, SunriseIcon, SunsetIcon } from "lucide-react";
import { useLayoutEffect } from "react";
import useGeneralStore from "../../lib/store/general";

function Header() {
  const [theme, toggleTheme] = useGeneralStore((state) => [
    state.theme,
    state.toggleTheme,
  ]);

  const safeAreaHeight = `max(0px, calc(env(safe-area-inset-top, 0.5rem) - 0.5rem))`;
  const headerHeight = "h-14";

  useLayoutEffect(() => {
    const inactive = theme === "light" ? "dark" : "light";
    document.body.classList.add(theme);
    document.body.classList.remove(inactive);
  }, [theme]);

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-30 border-b border-border bg-muted/80 px-4 text-foreground backdrop-blur transition-colors dark:bg-card/80"
        style={{
          paddingTop: safeAreaHeight,
          paddingLeft: "calc(env(safe-area-inset-left, 0px) + 1rem)",
          paddingRight: "calc(env(safe-area-inset-right, 0px) + 1rem)",
        }}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-2",
            headerHeight
          )}
        >
          <div className="flex items-center gap-2">
            <CloudIcon className="h-8 w-8" strokeWidth={2.25} />
            <h1 className="text-xl font-medium">bstell.online</h1>
          </div>
          <Button variant="ghost" onClick={toggleTheme}>
            {theme === "light" ? <SunsetIcon /> : <SunriseIcon />}
          </Button>
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
