import { Page } from "@/lib/pages";
import { cn } from "@order-app/ui";
import {
  HomeIcon,
  LandmarkIcon,
  ListIcon,
  LucideIcon,
  PrinterIcon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

type NavElement = {
  path: Page;
  text: string;
  icon: LucideIcon;
};

const navElements: NavElement[] = [
  { path: Page.Index, text: "Home", icon: HomeIcon },
  { path: Page.Events, text: "Events", icon: ListIcon },
  { path: Page.Companies, text: "Company", icon: LandmarkIcon },
  { path: Page.Printers, text: "Drucker", icon: PrinterIcon },
];

function NavigationElement({ element }: { element: NavElement }) {
  const location = useLocation();

  const isActive =
    location.pathname === element.path ||
    location.pathname.startsWith(`${element.path}/`);
  const Icon = element.icon;

  return (
    <li className="px-3 sm:px-1.5 sm:py-2">
      <Link
        to={element.path}
        className="block rounded-sm transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span
          className={cn(
            "flex flex-col items-center gap-y-[3px] text-sm transition-colors",
            "lg:flex-row lg:gap-x-3.5 lg:pl-3 lg:text-base",
            isActive
              ? "font-medium text-card-foreground"
              : "text-muted-foreground"
          )}
        >
          <Icon className="h-6 w-6" strokeWidth={isActive ? 2.25 : 2} />
          {element.text}
        </span>
      </Link>
    </li>
  );
}

function Navigation() {
  const safeAreaHeight = `max(0px, calc(env(safe-area-inset-bottom, 1rem) - 1rem))`;
  const navHeight = "h-16";

  return (
    <>
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 top-auto z-30 border-t border-border bg-card/80 px-4 pl-[env(safe-area-inset-left,_0px)] pr-[env(safe-area-inset-right,_0px)] backdrop-blur transition-colors dark:max-sm:bg-muted/80",
          "sm:right-auto sm:top-0 sm:z-auto sm:border-r sm:border-t-0 sm:pr-0 sm:pt-[calc(calc(env(safe-area-inset-top,_0px)_+_5rem))]"
        )}
        style={{
          paddingBottom: safeAreaHeight,
        }}
      >
        <ul
          className={cn(
            "mx-auto grid max-w-sm auto-cols-fr grid-flow-col items-center sm:w-20 sm:grid-flow-row lg:w-48 lg:gap-y-0.5 lg:pt-6",
            navHeight
          )}
        >
          {navElements.map((e) => (
            <NavigationElement element={e} key={e.path} />
          ))}
        </ul>
      </nav>
      <div
        className={cn(
          "w-full sm:h-px sm:max-w-[5rem] lg:max-w-[12rem]",
          navHeight
        )}
        style={{
          marginBottom: safeAreaHeight,
        }}
      />
    </>
  );
}

export default Navigation;
