import { cn } from "@order-app/ui";
import { HomeIcon, LucideIcon, UserIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Page } from "../../lib/pages";

type NavElement = {
  path: Page;
  text: string;
  icon: LucideIcon;
};

const navElements: NavElement[] = [
  { path: Page.Index, text: "Home", icon: HomeIcon },
  { path: Page.Profile, text: "Profil", icon: UserIcon },
];

function BottomNavigationElement({ element }: { element: NavElement }) {
  const location = useLocation();

  const isActive = location.pathname === element.path;
  const Icon = element.icon;

  return (
    <li className="px-3">
      <Link to={element.path}>
        <span
          className={cn(
            "flex flex-col items-center gap-[3px] text-sm transition-colors",
            isActive
              ? "font-medium text-card-foreground"
              : "text-card-foreground/60"
          )}
        >
          <Icon className="h-6 w-6" />
          {element.text}
        </span>
      </Link>
    </li>
  );
}

function BottomNavigation() {
  const safeAreaHeight = `max(0px, calc(env(safe-area-inset-bottom, 1.25rem) - 1.25rem))`;
  const navHeight = "h-16";

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-border/50 bg-card/80 px-4 backdrop-blur"
        style={{
          paddingBottom: safeAreaHeight,
        }}
      >
        <ul
          className={cn(
            "grid auto-cols-fr grid-flow-col items-center",
            navHeight
          )}
        >
          {navElements.map((e) => (
            <BottomNavigationElement element={e} key={e.path} />
          ))}
        </ul>
      </nav>
      <div
        className={cn("w-full", navHeight)}
        style={{
          marginBottom: safeAreaHeight,
        }}
      />
    </>
  );
}

export default BottomNavigation;
