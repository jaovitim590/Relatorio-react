import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";

export interface AlunoRef { 
  id: number; 
  nome: string; 
  mulher: boolean; 
}

export interface RelatorioFormState {
  values: {
    aluno_id: AlunoRef | null;
    dia: string;
    observacao: string;
    escalas: string;
    repertorio: string;
  };
  errors: Partial<{
    aluno_id: string;
    dia: string;
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

export default function RelatorioForm({ 
  formState, 
  onFieldChange, 
  onSubmit, 
  submitLabel = "Salvar", 
  backPath, 
  alunos 
}: RelatorioFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try { 
      await onSubmit(formState.values); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleBack = () => navigate(backPath ?? "/dashboard/relatorios");

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: "100%",
        maxWidth: 900,
        mx: "auto",
        mt: 3,
        p: { xs: 2, sm: 4 },
        bgcolor: "grey.900",
        borderRadius: 2,
      }}
    >
      <Stack spacing={3}>

        {/* Aluno e Data */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
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

          <TextField
            type="date"
            fullWidth
            label="Data"
            InputLabelProps={{ shrink: true }}
            value={formState.values.dia}
            onChange={e => onFieldChange("dia", e.target.value)}
            error={!!formState.errors.dia}
            helperText={formState.errors.dia ?? ""}
          />
        </Stack>

        {/* Observação */}
        <TextField
          fullWidth
          label="Observação"
          multiline
          minRows={6}
          maxRows={15}
          value={formState.values.observacao}
          onChange={e => onFieldChange("observacao", e.target.value)}
          error={!!formState.errors.observacao}
          helperText={formState.errors.observacao ?? "Digite as observações da aula"}
          placeholder="Ex: O aluno teve uma ótima evolução..."
          sx={{ '& .MuiInputBase-root': { alignItems: 'flex-start' } }}
        />

        {/* Escalas - Simplificado */}
        <TextField
          fullWidth
          label="Escalas"
          multiline
          minRows={5}
          maxRows={12}
          value={formState.values.escalas}
          onChange={e => onFieldChange("escalas", e.target.value)}
          error={!!formState.errors.escalas}
          helperText={formState.errors.escalas ?? "Liste as escalas trabalhadas na aula"}
          placeholder="Ex: Dó maior, Sol maior, Lá menor..."
          sx={{ '& .MuiInputBase-root': { alignItems: 'flex-start' } }}
        />

        {/* Repertório */}
        <TextField
          fullWidth
          label="Repertório"
          multiline
          minRows={8}
          maxRows={20}
          value={formState.values.repertorio}
          onChange={e => onFieldChange("repertorio", e.target.value)}
          error={!!formState.errors.repertorio}
          helperText={formState.errors.repertorio ?? "Liste as músicas trabalhadas"}
          placeholder="1. Música X..."
          sx={{ '& .MuiInputBase-root': { alignItems: 'flex-start' } }}
        />

      </Stack>

      <Stack direction="row" spacing={2} sx={{ mt: 4 }} justifyContent="space-between">
        {backPath && (
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
            Voltar
          </Button>
        )}
        <Button type="submit" variant="contained" disabled={isSubmitting} size="large">
          {submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}