import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { Home } from "./Home";
import { Aluno } from "./pages/aluno";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/:aluno", element: <Aluno /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
