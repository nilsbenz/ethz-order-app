import { UserLevel } from "@order-app/types";
import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./components/App.tsx";
import Layout from "./components/layout/Layout.tsx";
import { Page } from "./lib/pages.ts";
import Admin from "./routes/Admin.tsx";
import Home from "./routes/Home.tsx";
import Login from "./routes/Login.tsx";
import Printers from "./routes/Printers.tsx";
import Profile from "./routes/Profile.tsx";
import Register from "./routes/Register.tsx";
import Companies from "./routes/companies/Index.tsx";
import Articles from "./routes/events/Articles.tsx";
import Events from "./routes/events/Index.tsx";
import "./styles/main.css";

const queryClient = new QueryClient();

const pages: {
  [key in Page]: { element: JSX.Element; protected?: UserLevel };
} = {
  [Page.Index]: { element: <Home /> },
  [Page.Register]: { element: <Register /> },
  [Page.Login]: { element: <Login /> },
  [Page.Profile]: { element: <Profile />, protected: UserLevel.User },
  [Page.Events]: { element: <Events />, protected: UserLevel.Admin },
  [Page.Articles]: { element: <Articles />, protected: UserLevel.Admin },
  [Page.Companies]: { element: <Companies />, protected: UserLevel.Admin },
  [Page.Printers]: { element: <Printers />, protected: UserLevel.Admin },
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
      </App>
    </QueryClientProvider>
  </React.StrictMode>
);
