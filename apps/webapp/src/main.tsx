import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/layout/Layout.tsx";
import { Page } from "./lib/pages.ts";
import Home from "./routes/Home.tsx";
import Profile from "./routes/Profile.tsx";
import "./styles/main.css";

const pages: { [key in Page]: JSX.Element } = {
  [Page.Index]: <Home />,
  [Page.Profile]: <Profile />,
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
