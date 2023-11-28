import useCompany from "@/lib/hooks/useCompany";
import useCompanyAdmins from "@/lib/hooks/useCompanyAdmins";
import useCompanyEvents from "@/lib/hooks/useCompanyEvents";
import useEvent from "@/lib/hooks/useEvent";
import { Page } from "@/lib/pages";
import useAuthStore from "@/lib/store/auth";
import useCompanyStore from "@/lib/store/company";
import { UserLevel } from "@order-app/types";
import { Navigate, useLocation, useParams } from "react-router-dom";
import Header from "./Header";
import Navigation from "./Navigation";

function Layout({
  protect,
  children,
}: {
  protect?: UserLevel;
  children?: JSX.Element | JSX.Element[];
}) {
  const { setCompany, setAdmins, setEvents } = useCompanyStore();
  const user = useAuthStore((state) => state.user);
  const location = useLocation();
  const { company: companyId, event: eventId } = useParams();
  useCompany({ companyId, callback: setCompany });
  useCompanyAdmins({ companyId, callback: setAdmins });
  useCompanyEvents({ companyId, callback: setEvents });
  useEvent({ eventId });

  if (user === undefined) {
    return null;
  }

  if (!!protect && user === null) {
    return (
      <Navigate
        to={{
          pathname: Page.Login,
          search: `?next=${location.pathname}`,
        }}
      />
    );
  }

  return (
    <>
      <Header />
      <div className="flex flex-col sm:flex-row-reverse">
        <div className="container mx-auto w-full max-w-xl py-8">{children}</div>
        <Navigation />
      </div>
    </>
  );
}

export default Layout;
