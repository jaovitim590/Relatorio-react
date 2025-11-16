import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import { Home } from "./Home";
import { Login } from "./pages/login";
import CrudDashboard from "./CrudDashboard";
import RootLayout from "./assets/components/RootLayout";
import { Aluno } from "./pages/aluno";
import { Relatorio } from "./pages/relatorio";

// CRUD Aluno
import AlunoList from "./assets/components/dash/AlunoList";
import AlunoShow from "./assets/components/dash/AlunoShow";
import AlunoEdit from "./assets/components/dash/AlunoEdit";
import AlunoCreate from "./assets/components/dash/AlunoCreate";

// CRUD Relatório
import RelatorioList from "./assets/components/dash/RelatorioList";
import RelatorioShow from "./assets/components/dash/RelatorioShow";
import RelatorioEdit from "./assets/components/dash/RelatorioEdit";
import RelatorioCreate from "./assets/components/dash/RelatorioCreate";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Login /> },
      // rota pública do aluno
      { path: "/:aluno", element: <Aluno /> },
      { path: "/relatorio/:id", element: <Relatorio /> },
      {
        path: "/dashboard",
        element: <CrudDashboard />,
        children: [
          { path: "alunos", element: <AlunoList /> },
          { path: "alunos/new", element: <AlunoCreate /> },
          { path: "alunos/:id", element: <AlunoShow /> },
          { path: "alunos/:id/edit", element: <AlunoEdit /> },
          { path: "relatorios", element: <RelatorioList /> },
          { path: "relatorios/new", element: <RelatorioCreate /> },
          { path: "relatorios/:id", element: <RelatorioShow /> },
          { path: "relatorios/:id/edit", element: <RelatorioEdit /> },
        ],
      },
    ],
  },
]);


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
