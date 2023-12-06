import { Page, SubPage } from "@/lib/pages";
import useAuthStore from "@/lib/store/auth";
import useEventStore from "@/lib/store/event";
import { UserLevel } from "@order-app/types";
import { cn } from "@order-app/ui";
import {
  HomeIcon,
  LandmarkIcon,
  ListIcon,
  LucideIcon,
  ShieldIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

type NavElement = {
  path: string;
  text: string;
  icon: LucideIcon;
};

const navElementsUser: NavElement[] = [
  { path: Page.Index, text: "Home", icon: HomeIcon },
];

const navElementsWaiter: NavElement[] = [
  {
    path: `${Page.Companies}/{company}/${SubPage.Events}/{event}/${SubPage.Order}`,
    text: "Bestellung",
    icon: ShoppingCartIcon,
  },
];

const navElementsAdmin: NavElement[] = [
  { path: Page.Index, text: "Home", icon: HomeIcon },
  {
    path: `${Page.Companies}/{company}/${SubPage.Events}`,
    text: "Events",
    icon: ListIcon,
  },
  {
    path: `${Page.Companies}/{company}`,
    text: "Verein",
    icon: LandmarkIcon,
  },
];

const navElementsSuperAdmin: NavElement[] = [
  { path: Page.Index, text: "Home", icon: HomeIcon },
  { path: Page.Companies, text: "Vereine", icon: LandmarkIcon },
  { path: Page.Admin, text: "Admin", icon: ShieldIcon },
];

function NavigationElement({ element }: { element: NavElement }) {
  const location = useLocation();
  const userData = useAuthStore((state) => state.userData);

  const isActive =
    location.pathname === element.path ||
    (location.pathname.startsWith(`${element.path}/`) &&
      (userData?.level === UserLevel.SuperAdmin ||
        !(
          !element.path.includes(SubPage.Events) &&
          location.pathname.includes(SubPage.Events)
        )));
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
            isActive ? "font-medium text-foreground" : "text-muted-foreground"
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
  const userData = useAuthStore((state) => state.userData);
  const event = useEventStore((state) => state.event);

  let navElements =
    userData?.level === UserLevel.SuperAdmin
      ? navElementsSuperAdmin
      : userData?.level === UserLevel.Admin
      ? navElementsAdmin
      : userData?.level === UserLevel.Waiter
      ? navElementsWaiter
      : navElementsUser;

  const safeAreaHeight = `max(0px, calc(env(safe-area-inset-bottom, 1rem) - 1rem))`;

  if (userData?.level === UserLevel.Admin) {
    navElements = navElements.map((e) => ({
      ...e,
      path: e.path.replace("{company}", userData.company ?? "unknown"),
    }));
  }

  if (userData?.level === UserLevel.Waiter) {
    navElements = navElements.map((e) => ({
      ...e,
      path: e.path
        .replace("{company}", event?.companyId ?? "unknown")
        .replace("{event}", event?.id ?? "unknown"),
    }));
  }

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--safe-area-bottom",
      safeAreaHeight
    );
    document.documentElement.style.setProperty(
      "--safe-area-bottom",
      safeAreaHeight
    );
  }, [safeAreaHeight]);

  return (
    <>
      <nav
        className={cn(
          "fixed bottom-0 left-0 right-0 top-auto z-30 border-t border-border bg-background/80 pl-[calc(env(safe-area-inset-left,_0px)_+_1rem)] pr-[calc(env(safe-area-inset-right,_0px)_+_1rem)] backdrop-blur transition-colors dark:max-sm:bg-card/80",
          "sm:right-auto sm:top-0 sm:z-auto sm:border-r sm:border-t-0 sm:pl-[env(safe-area-inset-left,_0px)] sm:pr-0 sm:pt-[calc(calc(env(safe-area-inset-top,_0px)_+_5rem))]"
        )}
        style={{
          paddingBottom: safeAreaHeight,
        }}
      >
        <ul className="mx-auto grid h-[var(--nav-height)] max-w-sm auto-cols-fr grid-flow-col items-center sm:w-20 sm:grid-flow-row lg:w-48 lg:gap-y-0.5 lg:pt-6">
          {navElements.map((e) => (
            <NavigationElement element={e} key={e.path} />
          ))}
        </ul>
      </nav>
      <div
        className="h-[var(--nav-height)] w-full sm:h-px sm:max-w-[5rem] lg:max-w-[12rem]"
        style={{
          marginBottom: safeAreaHeight,
        }}
      />
    </>
  );
}

export default Navigation;
