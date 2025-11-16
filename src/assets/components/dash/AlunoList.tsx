import * as React from "react";
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
  type GridPaginationModel,
  type GridRenderCellParams,
  type GridRowParams,
  gridClasses,
} from "@mui/x-data-grid";
import axios from "axios";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import PageContainer from "./PageContainer";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDialogs } from "../../../hooks/useDialogs/useDialogs";
import useNotifications from "../../../hooks/useNotifications/useNotifications";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { API_URL } from "../../../service/api";

interface Aluno {
  id: number;
  nome: string;
  mulher: boolean;
}

export default function AlunoList() {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dialogs = useDialogs();
  const notifications = useNotifications();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // detecta celular

  const INITIAL_PAGE_SIZE = 5;

  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 0,
    pageSize: searchParams.get("pageSize") ? Number(searchParams.get("pageSize")) : INITIAL_PAGE_SIZE,
  });

  const [alunos, setAlunos] = React.useState<Aluno[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  // Carregar dados
  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await axios.get<Aluno[]>(`${API_URL}/aluno`);
      setAlunos(res.data);
    } catch (err) {
      setError(err as Error);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = React.useCallback(() => {
    if (!isLoading) loadData();
  }, [isLoading, loadData]);

  const handleCreateClick = React.useCallback(() => {
    navigate("/dashboard/alunos/new");
  }, [navigate]);

  const handleDelete = React.useCallback(
    (aluno: Aluno) => async () => {
      const confirmed = await dialogs.confirm(
        `Deseja realmente deletar ${aluno.nome}?`,
        { title: "Deletar Aluno?", severity: "error", okText: "Deletar", cancelText: "Cancelar" }
      );
      if (!confirmed) return;

      setIsLoading(true);
      try {
        await axios.delete(`${API_URL}/aluno/${aluno.id}`);
        notifications.show("Aluno deletado com sucesso.", { severity: "success", autoHideDuration: 3000 });
        loadData();
      } catch (err) {
        notifications.show(`Falha ao deletar aluno. ${(err as Error).message}`, { severity: "error", autoHideDuration: 3000 });
      }
      setIsLoading(false);
    },
    [dialogs, notifications, loadData]
  );

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "nome", headerName: "Nome", flex: 1 },
    {
      field: "mulher",
      headerName: "Sexo",
      width: 120,
      valueFormatter: (params: GridRenderCellParams) => (params.value ? "macho" : "Muie"),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      width: 200,
      getActions: (params: GridRowParams<Aluno>) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Editar"
          onClick={() => navigate(`/dashboard/alunos/${params.row.id}/edit`)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={<DeleteIcon />}
          label="Deletar"
          onClick={handleDelete(params.row)}
        />,
      ],
    },
  ];

  const pageTitle = "Alunos";

  return (
    <PageContainer
      title={pageTitle}
      breadcrumbs={[{ title: pageTitle }]}
      actions={
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Reload data" placement="right" enterDelay={1000}>
            <div>
              <IconButton size="small" aria-label="refresh" onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </div>
          </Tooltip>
          <Button variant="contained" onClick={handleCreateClick} startIcon={<AddIcon />}>
            Create
          </Button>
        </Stack>
      }
    >
      <Box sx={{ flex: 1, width: "100%" }}>
        {error ? (
          <Box sx={{ flexGrow: 1 }}>
            <Alert severity="error">{error.message}</Alert>
          </Box>
        ) : isMobile ? (
          // Render mobile-friendly cards
          <Stack spacing={2}>
            {alunos.map((aluno) => (
              <Box key={aluno.id} p={2} boxShadow={2} borderRadius={2}>
                <div><strong>ID:</strong> {aluno.id}</div>
                <div><strong>Nome:</strong> {aluno.nome}</div>
                <div><strong>Sexo:</strong> {aluno.mulher ? "macho" : "Muie"}</div>
                <Stack direction="row" spacing={1} mt={1}>
                  <Button size="small" variant="outlined" onClick={() => navigate(`/dashboard/alunos/${aluno.id}/edit`)}>
                    Editar
                  </Button>
                  <Button size="small" color="error" variant="outlined" onClick={handleDelete(aluno)}>
                    Deletar
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : (
          // Desktop DataGrid
          <Box sx={{ flex: 1, width: "100%", display: "flex", flexDirection: "column" }}>
            <DataGrid
              rows={alunos}
              columns={columns}
              getRowId={(row) => row.id}
              pagination
              paginationMode="client"
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              loading={isLoading}
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 20]}
              showToolbar
              sx={{
                [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: { outline: "transparent" },
                [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: { outline: "none" },
                [`& .${gridClasses.row}:hover`]: { cursor: "pointer" },
                flex: 1,
                minHeight: 600,
              }}
            />
          </Box>
        )}
      </Box>
    </PageContainer>
  );
}
