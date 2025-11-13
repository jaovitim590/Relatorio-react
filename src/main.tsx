import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { Dash } from "./dash";
import { Home } from "./Home";
import { Aluno } from "./pages/aluno";
import { Login } from "./pages/login";
import { AuthProvider } from "./context/AuthContext";
import { Relatorio } from "./pages/relatorio"; // 👈 importe a nova página

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <Home />
      </AuthProvider>
    ),
  },
  {
    path: "/login",
    element: (
      <AuthProvider>
        <Login />
      </AuthProvider>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <AuthProvider>
        <Dash />
      </AuthProvider>
    ),
  },
  {
    path: "/:aluno",
    element: (
      <AuthProvider>
        <Aluno />
      </AuthProvider>
    ),
  },
  {
    path: "/relatorio/:id",
    element: (
      <AuthProvider>
        <Relatorio />
      </AuthProvider>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
