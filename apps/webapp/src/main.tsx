import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout.tsx";
import "./index.css";
import { Page } from "./lib/pages.ts";
import Home from "./routes/Home.tsx";

const pages: { [key in Page]: { element: JSX.Element; withLayout: boolean } } =
  {
    [Page.Index]: { element: <Home />, withLayout: true },
    [Page.Profile]: { element: <div>Profil</div>, withLayout: true },
  } as const;

const router = createBrowserRouter(
  Object.keys(pages).map((path) => {
    const page = pages[path as Page];
    const element = page.withLayout ? (
      <Layout>{page.element}</Layout>
    ) : (
      page.element
    );
    return {
      path,
      element,
    };
  })
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
