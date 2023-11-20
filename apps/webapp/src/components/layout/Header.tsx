import { Button, cn } from "@order-app/ui";
import {
  CloudIcon,
  LogInIcon,
  LogOutIcon,
  SunriseIcon,
  SunsetIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Page } from "@/lib/pages";
import useGeneralStore from "@/lib/store/general";
import useAuthStore from "@/lib/store/auth";
import { signOut } from "@/lib/auth";

function Header() {
  const [theme, toggleTheme] = useGeneralStore((state) => [
    state.theme,
    state.toggleTheme,
  ]);
  const user = useAuthStore((state) => state.user);

  const safeAreaHeight = `max(0px, calc(env(safe-area-inset-top, 0.5rem) - 0.5rem))`;
  const headerHeight = "h-14";

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-30 border-b border-border bg-muted/80 text-foreground backdrop-blur transition-colors dark:bg-card/80"
        style={{
          paddingTop: safeAreaHeight,
          paddingLeft: "calc(env(safe-area-inset-left, 0px) + 0.5rem)",
          paddingRight: "calc(env(safe-area-inset-right, 0px) + 0.5rem)",
        }}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-2",
            headerHeight
          )}
        >
          <Button variant="ghost" asChild>
            <Link to={Page.Index} className="flex items-center gap-2 px-2">
              <CloudIcon className="h-8 w-8" strokeWidth={2.25} />
              <h1 className="text-xl font-medium">bstell.online</h1>
            </Link>
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" onClick={toggleTheme} className="p-2">
              {theme === "light" ? (
                <SunsetIcon strokeWidth={2.25} />
              ) : (
                <SunriseIcon strokeWidth={2.25} />
              )}
            </Button>
            {user ? (
              <Button variant="ghost" className="p-2" onClick={signOut}>
                <LogOutIcon strokeWidth={2.25} />
              </Button>
            ) : (
              <Button variant="ghost" asChild className="p-2">
                <Link to={Page.Login}>
                  <LogInIcon strokeWidth={2.25} />
                </Link>
              </Button>
            )}
          </div>
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
