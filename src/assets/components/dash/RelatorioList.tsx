import * as React from "react";
import {
  GridActionsCellItem,
  DataGrid,
  type GridColDef,
  type GridPaginationModel,
  type GridRowParams,
  gridClasses,
} from "@mui/x-data-grid";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
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

interface Relatorio {
  id: number;
  aluno: Aluno;
  dia: string;
  observacao: string;
  repertorio: string;
  escalas: string;
}

export default function RelatorioList() {
  const [relatorios, setRelatorios] = React.useState<Relatorio[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const navigate = useNavigate();
  const dialogs = useDialogs();
  const notifications = useNotifications();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const loadData = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get<Relatorio[]>(`${API_URL}/relatorio`);
      setRelatorios(res.data);
    } catch (err) {
      setError(err as Error);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = () => {
    if (!isLoading) loadData();
  };

  const handleDelete = React.useCallback(
    (relatorio: Relatorio) => async () => {
      const confirmed = await dialogs.confirm(
        `Deseja realmente deletar ${relatorio.aluno.nome}?`,
        { title: "Deletar Relatório?", severity: "error", okText: "Deletar", cancelText: "Cancelar" }
      );
      if (!confirmed) return;

      setIsLoading(true);
      try {
        await axios.delete(`${API_URL}/relatorio/${relatorio.id}`);
        notifications.show("Relatório deletado com sucesso.", { severity: "success", autoHideDuration: 3000 });
        loadData();
      } catch (err) {
        notifications.show(`Falha ao deletar relatório. ${(err as Error).message}`, { severity: "error", autoHideDuration: 3000 });
      }
      setIsLoading(false);
    },
    [dialogs, notifications, loadData]
  );

  const columns: GridColDef<Relatorio>[] = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "aluno",
      headerName: "Aluno",
      flex: 1,
      renderCell: (params) => params.row?.aluno?.nome ?? "—",
    },
    { field: "dia", headerName: "Dia", width: 120, flex: 1 },
    {
      field: "observacao",
      headerName: "Observação",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "repertorio",
      headerName: "Repertório",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "escalas",
      headerName: "Escalas",
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <div
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: "100%",
            }}
          >
            {params.value}
          </div>
        </Tooltip>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Ações",
      width: 200,
      getActions: (params: GridRowParams<Relatorio>) => [
        <GridActionsCellItem
          key="edit"
          icon={<EditIcon />}
          label="Editar"
          onClick={() => navigate(`/dashboard/relatorios/${params.row.id}/edit`)}
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

  const pageTitle = "Relatórios";

  return (
    <PageContainer title={pageTitle} breadcrumbs={[{ title: pageTitle }]}>
      <Stack direction="row" spacing={1} mb={1}>
        <Button variant="contained" component={Link} to="/dashboard/relatorios/new" startIcon={<AddIcon />}>
          Novo Relatório
        </Button>
        <Tooltip title="Atualizar">
          <IconButton onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {error ? (
        <Alert severity="error">{error.message}</Alert>
      ) : isMobile ? (
        <Stack spacing={2}>
          {relatorios.map((r) => (
            <Box key={r.id} p={2} boxShadow={2} borderRadius={2}>
              <div><strong>ID:</strong> {r.id}</div>
              <div><strong>Aluno:</strong> {r.aluno.nome}</div>
              <div><strong>Dia:</strong> {r.dia}</div>
              <div><strong>Observação:</strong> {r.observacao}</div>
              <div><strong>Repertório:</strong> {r.repertorio}</div>
              <div><strong>Escalas:</strong> {r.escalas}</div>
              <Stack direction="row" spacing={1} mt={1}>
                <Button size="small" variant="outlined" onClick={() => navigate(`/dashboard/relatorios/${r.id}/edit`)}>
                  Editar
                </Button>
                <Button size="small" color="error" variant="outlined" onClick={handleDelete(r)}>
                  Deletar
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      ) : (
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={relatorios}
            columns={columns}
            getRowId={(row) => row.id}
            pagination
            paginationMode="client"
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[5, 10, 20]}
            loading={isLoading}
            disableRowSelectionOnClick
            showToolbar
            sx={{
              [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: { outline: "transparent" },
              [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: { outline: "none" },
              [`& .${gridClasses.row}:hover`]: { cursor: "pointer" },
            }}
          />
        </Box>
      )}
    </PageContainer>
  );
}
