import { UserLevel } from "@order-app/types";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./components/App.tsx";
import Layout from "./components/layout/Layout.tsx";
import { Page, SubPage } from "./lib/pages.ts";
import Admin from "./routes/Admin.tsx";
import Home from "./routes/Home.tsx";
import Login from "./routes/Login.tsx";
import Printers from "./routes/Printers.tsx";
import Profile from "./routes/Profile.tsx";
import Register from "./routes/Register.tsx";
import Company from "./routes/companies/Company.tsx";
import Companies from "./routes/companies/Index.tsx";
import Articles from "./routes/companies/events/Articles.tsx";
import Event from "./routes/companies/events/Event.tsx";
import Events from "./routes/companies/events/Index.tsx";
import JoinEvent from "./routes/companies/events/JoinEvent.tsx";
import Order from "./routes/companies/events/Order.tsx";
import Orders from "./routes/companies/events/Orders.tsx";
import Tables from "./routes/companies/events/Tables.tsx";
import Visualizations from "./routes/companies/events/Visualizations.tsx";
import Waiters from "./routes/companies/events/Waiters.tsx";
import "./styles/main.css";

const queryClient = new QueryClient();

const pages: {
  [key in Page]: { element: JSX.Element; protected?: UserLevel };
} = {
  [Page.Index]: { element: <Home /> },
  [Page.Register]: { element: <Register /> },
  [Page.Login]: { element: <Login /> },
  [Page.Profile]: { element: <Profile />, protected: UserLevel.User },
  [Page.Companies]: { element: <Companies />, protected: UserLevel.SuperAdmin },
  [`${Page.Companies}/:company`]: {
    element: <Company />,
    protected: UserLevel.Admin,
  },
  [`${Page.Companies}/:company/${SubPage.Events}`]: {
    element: <Events />,
    protected: UserLevel.Admin,
  },
  [`${Page.Companies}/:company/${SubPage.Events}/:event`]: {
    element: <Event />,
    protected: UserLevel.Admin,
  },
  [`${Page.Companies}/:company/${SubPage.Events}/:event/${SubPage.Orders}`]: {
    element: <Orders />,
    protected: UserLevel.Admin,
  },
  [`${Page.Companies}/:company/${SubPage.Events}/:event/${SubPage.Articles}`]: {
    element: <Articles />,
    protected: UserLevel.Admin,
  },
  [`${Page.Companies}/:company/${SubPage.Events}/:event/${SubPage.Tables}`]: {
    element: <Tables />,
    protected: UserLevel.Admin,
  },
  [`${Page.Companies}/:company/${SubPage.Events}/:event/${SubPage.Waiters}`]: {
    element: <Waiters />,
    protected: UserLevel.Admin,
  },
  [`${Page.Companies}/:company/${SubPage.Events}/:event/${SubPage.Visualizations}`]:
    {
      element: <Visualizations />,
      protected: UserLevel.Admin,
    },
  [`${Page.Companies}/:company/${SubPage.Events}/:event/${SubPage.Join}`]: {
    element: <JoinEvent />,
    protected: UserLevel.User,
  },
  [`${Page.Companies}/:company/${SubPage.Events}/:event/${SubPage.Order}`]: {
    element: <Order />,
    protected: UserLevel.Waiter,
  },
  [Page.Printers]: { element: <Printers /> },
  [Page.Admin]: { element: <Admin />, protected: UserLevel.SuperAdmin },
} as const;

const router = createBrowserRouter(
  Object.keys(pages).map((path) => ({
    path,
    element: (
      <Layout protect={pages[path as Page].protected}>
        {pages[path as Page].element}
      </Layout>
    ),
  }))
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App>
        <RouterProvider router={router} />
        <Toaster
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                "flex gap-2 items-center bg-muted/80 backdrop-blur text-foreground w-full rounded-lg border border-border p-4",
              error:
                "bg-destructive/80 text-destructive-foreground border-destructive-foreground/10",
            },
          }}
        />
      </App>
    </QueryClientProvider>
  </React.StrictMode>
);
