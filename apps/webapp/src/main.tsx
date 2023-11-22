import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import App from "./components/App.tsx";
import Layout from "./components/layout/Layout.tsx";
import { Page } from "./lib/pages.ts";
import Home from "./routes/Home.tsx";
import Login from "./routes/Login.tsx";
import Printers from "./routes/Printers.tsx";
import Profile from "./routes/Profile.tsx";
import Register from "./routes/Register.tsx";
import Companies from "./routes/companies/Index.tsx";
import Articles from "./routes/events/Articles.tsx";
import Events from "./routes/events/Index.tsx";
import "./styles/main.css";

const pages: { [key in Page]: { element: JSX.Element; protected: boolean } } = {
  [Page.Index]: { element: <Home />, protected: false },
  [Page.Register]: { element: <Register />, protected: false },
  [Page.Login]: { element: <Login />, protected: false },
  [Page.Profile]: { element: <Profile />, protected: true },
  [Page.Events]: { element: <Events />, protected: false },
  [Page.Articles]: { element: <Articles />, protected: false },
  [Page.Companies]: { element: <Companies />, protected: false },
  [Page.Printers]: { element: <Printers />, protected: false },
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
    <App>
      <RouterProvider router={router} />
    </App>
  </React.StrictMode>
);
