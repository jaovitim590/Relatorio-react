import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";

export interface AlunoRef { id: number; nome: string; mulher: boolean; }

export interface RelatorioFormState {
  values: {
    aluno_id: AlunoRef | null;
    data: string;
    observacao: string;
    escalas: string;
    repertorio: string;
  };
  errors: Partial<{
    aluno_id: string;
    data: string;
    observacao: string;
    escalas: string;
    repertorio: string;
  }>;
}

export interface RelatorioFormProps {
  formState: RelatorioFormState;
  onFieldChange: (field: keyof RelatorioFormState["values"], value: string | AlunoRef | null) => void;
  onSubmit: (values: RelatorioFormState["values"]) => Promise<void> | void;
  submitLabel?: string;
  backPath?: string;
  alunos: AlunoRef[];
}

export default function RelatorioForm({ formState, onFieldChange, onSubmit, submitLabel = "Salvar", backPath, alunos }: RelatorioFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try { await onSubmit(formState.values); } finally { setIsSubmitting(false); }
  };

  const handleBack = () => navigate(backPath ?? "/dashboard/relatorios");

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: 600,
        mx: "auto",
        mt: 5,
        p: 4,
        bgcolor: "grey.900",
        borderRadius: 2,
      }}
    >
      {/* Use CSS grid via Box to avoid Grid typing mismatches */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
        }}
      >
        <Box 
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          paddingBottom: 8
        }}
        >
        <Box>
          <TextField
            select
            fullWidth
            label="Aluno"
            value={formState.values.aluno_id?.id ?? ""}
            onChange={e =>
              onFieldChange(
                "aluno_id",
                alunos.find(a => a.id === Number((e.target as HTMLInputElement).value)) ?? null
              )
            }
            error={!!formState.errors.aluno_id}
            helperText={formState.errors.aluno_id ?? ""}
          >
            <MenuItem value="">-- selecione --</MenuItem>
            {alunos.map(a => (
              <MenuItem key={a.id} value={a.id}>
                {a.nome} {a.mulher ? "(F)" : "(M)"}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box>
          <TextField
            type="date"
            fullWidth
            label="Data"
            InputLabelProps={{ shrink: true }}
            value={formState.values.data}
            onChange={e => onFieldChange("data", e.target.value)}
            error={!!formState.errors.data}
            helperText={formState.errors.data ?? ""}
          />
        </Box>
        </Box>

        <Box sx={{ gridColumn: { xs: "1 / -1", sm: "auto" } }}>
          <TextField
            fullWidth
            label="Observação"
            value={formState.values.observacao}
            onChange={e => onFieldChange("observacao", e.target.value)}
            error={!!formState.errors.observacao}
            helperText={formState.errors.observacao ?? ""}
          />
        </Box>

        <Box>
          <TextField
            fullWidth
            label="Escalas"
            value={formState.values.escalas}
            onChange={e => onFieldChange("escalas", e.target.value)}
            error={!!formState.errors.escalas}
            helperText={formState.errors.escalas ?? ""}
          />
        </Box>

        <Box>
          <TextField
            fullWidth
            label="Repertório"
            value={formState.values.repertorio}
            onChange={e => onFieldChange("repertorio", e.target.value)}
            error={!!formState.errors.repertorio}
            helperText={formState.errors.repertorio ?? ""}
          />
        </Box>
      </Box>

      <Stack direction="row" spacing={2} sx={{ mt: 4 }} justifyContent="space-between">
        {backPath && (
          <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Voltar
          </Button>
        )}
        <Button type="submit" variant="contained" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}