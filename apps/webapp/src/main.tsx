import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout.tsx";
import { Page } from "./lib/pages.ts";
import Home from "./routes/Home.tsx";
import Profile from "./routes/Profile.tsx";
import "./styles/main.css";
import Articles from "./routes/events/Articles.tsx";
import Events from "./routes/events/Index.tsx";
import Companies from "./routes/companies/Index.tsx";

const pages: { [key in Page]: JSX.Element } = {
  [Page.Index]: <Home />,
  [Page.Profile]: <Profile />,
  [Page.Events]: <Events />,
  [Page.Articles]: <Articles />,
  [Page.Companies]: <Companies />,
} as const;

const router = createBrowserRouter(
  Object.keys(pages).map((path) => ({
    path,
    element: <Layout>{pages[path as Page]}</Layout>,
  }))
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
