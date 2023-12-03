import { Page } from "@/lib/pages";
import useAuthStore from "@/lib/store/auth";
import useGeneralStore from "@/lib/store/general";
import { Button, cn } from "@order-app/ui";
import {
  CloudIcon,
  LogInIcon,
  SunriseIcon,
  SunsetIcon,
  UserIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

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
        className="fixed left-0 right-0 top-0 z-30 border-b border-border bg-card/80 text-foreground backdrop-blur transition-colors dark:bg-background/80"
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
            <Link
              to={Page.Index}
              className="flex items-center gap-2 pl-2 pr-2 transition-none"
            >
              <CloudIcon className="h-8 w-8" strokeWidth={2.25} />
              <h1 className="text-xl font-medium">bstell.online</h1>
            </Link>
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" onClick={toggleTheme} size="icon">
              {theme === "light" ? (
                <SunsetIcon strokeWidth={2.25} />
              ) : (
                <SunriseIcon strokeWidth={2.25} />
              )}
            </Button>
            <Button
              variant="ghost"
              asChild
              size="icon"
              className="transition-shadow"
            >
              {user ? (
                <Link to={Page.Profile}>
                  <UserIcon strokeWidth={2.25} />
                </Link>
              ) : (
                <Link to={Page.Login}>
                  <LogInIcon strokeWidth={2.25} />
                </Link>
              )}
            </Button>
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
