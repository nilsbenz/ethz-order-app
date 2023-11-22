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

const pages: { [key in Page]: JSX.Element } = {
  [Page.Index]: <Home />,
  [Page.Register]: <Register />,
  [Page.Login]: <Login />,
  [Page.Profile]: <Profile />,
  [Page.Events]: <Events />,
  [Page.Articles]: <Articles />,
  [Page.Companies]: <Companies />,
  [Page.Printers]: <Printers />,
} as const;

const router = createBrowserRouter(
  Object.keys(pages).map((path) => ({
    path,
    element: <Layout>{pages[path as Page]}</Layout>,
  }))
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </React.StrictMode>
);
