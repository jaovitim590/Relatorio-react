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
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
        `Deseja realmente deletar o relatório de ${relatorio.aluno.nome}?`,
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
    width: 200,
    renderCell: (params) => params.row?.aluno?.nome ?? "—",
  },
  { field: "dia", headerName: "Dia", width: 120 },

  {
    field: "observacao",
    headerName: "Observação",
    width: 200,
    renderCell: (params) => (
      <Tooltip title={params.value || ""}>
        <div style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {params.value || "—"}
        </div>
      </Tooltip>
    ),
  },

  // 👇 ADICIONADO
  {
    field: "repertorio",
    headerName: "Repertório",
    width: 200,
    renderCell: (params) => (
      <Tooltip title={params.value || ""}>
        <div style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {params.value || "—"}
        </div>
      </Tooltip>
    ),
  },

  // 👇 ADICIONADO
  {
    field: "escalas",
    headerName: "Escalas",
    width: 200,
    renderCell: (params) => (
      <Tooltip title={params.value || ""}>
        <div style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}>
          {params.value || "—"}
        </div>
      </Tooltip>
    ),
  },

  {
    field: "actions",
    type: "actions",
    headerName: "Ações",
    width: 150,
    getActions: (params: GridRowParams<Relatorio>) => [
      <GridActionsCellItem
        key="view"
        icon={<VisibilityIcon />}
        label="Visualizar"
        onClick={() => navigate(`/relatorio/${params.row.id}`)}
      />,
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
      <Stack direction="row" spacing={1} mb={2}>
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
        <Stack spacing={3}>
          {relatorios.map((r) => (
            <Card key={r.id} sx={{ bgcolor: "grey.900", color: "white" }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Chip label={`ID: ${r.id}`} size="small" color="primary" />
                  <Typography variant="caption" color="grey.400">
                    {new Date(r.dia).toLocaleDateString("pt-BR")}
                  </Typography>
                </Stack>

                <Typography variant="h6" gutterBottom>
                  {r.aluno.nome}
                </Typography>

                <Box mb={2}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Observação:
                  </Typography>
                  <Typography variant="body2" color="grey.300" sx={{ whiteSpace: "pre-line" }}>
                    {r.observacao}
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Repertório:
                  </Typography>
                  <Typography variant="body2" color="grey.300" sx={{ whiteSpace: "pre-line" }}>
                    {r.repertorio}
                  </Typography>
                </Box>

                <Box mb={2}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Escalas:
                  </Typography>
                  <Typography variant="body2" color="grey.300" sx={{ whiteSpace: "pre-line" }}>
                    {r.escalas}
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} mt={3}>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<VisibilityIcon />}
                    onClick={() => navigate(`/relatorio/${r.id}`)}
                  >
                    Ver Completo
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/dashboard/relatorios/${r.id}/edit`)}
                  >
                    Editar
                  </Button>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={handleDelete(r)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
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
            initialState={{
              sorting: {
                sortModel: [{ field: 'id', sort: 'asc' }],
              },
            }}
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
