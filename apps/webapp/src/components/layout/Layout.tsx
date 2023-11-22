import { Page } from "@/lib/pages";
import useAuthStore from "@/lib/store/auth";
import { UserLevel } from "@order-app/types";
import { Navigate, useLocation } from "react-router-dom";
import Header from "./Header";
import Navigation from "./Navigation";

function Layout({
  protect,
  children,
}: {
  protect?: UserLevel;
  children?: JSX.Element | JSX.Element[];
}) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

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
