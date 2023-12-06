import { Page, SubPage } from "@/lib/pages";
import useAuthStore from "@/lib/store/auth";
import useEventStore from "@/lib/store/event";
import { UserLevel } from "@order-app/types";
import { Navigate } from "react-router-dom";

export default function Home() {
  const userData = useAuthStore((state) => state.userData);
  const event = useEventStore((state) => state.event);

  if (userData?.level === UserLevel.Waiter && event) {
    return (
      <Navigate
        replace
        to={`${Page.Companies}/${event?.companyId}/${SubPage.Events}/${event.id}/${SubPage.Order}`}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="h1">Hopp</h2>
    </div>
  );
}
