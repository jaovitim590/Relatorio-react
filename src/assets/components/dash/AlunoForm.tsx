import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';

export interface AlunoFormState {
  values: {
    nome: string;
    mulher: boolean;
  };
  errors: Partial<{
    nome: string;
    mulher: string;
  }>;
}

export interface AlunoFormProps {
  formState: AlunoFormState;
  onFieldChange: (
    field: keyof AlunoFormState['values'],
    value: string | boolean
  ) => void;
  onSubmit: (values: AlunoFormState['values']) => Promise<void>;
  onReset?: (values: AlunoFormState['values']) => void;
  submitLabel?: string;
  backPath?: string;
}

export default function AlunoForm({
  formState,
  onFieldChange,
  onSubmit,
  onReset,
  submitLabel = "Salvar",
  backPath,
}: AlunoFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const formValues = formState?.values ?? { nome: '', mulher: false };
  const formErrors = formState?.errors ?? {};

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
        await onSubmit(formValues);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, onSubmit]
  );

  const handleReset = React.useCallback(() => {
    if (onReset) onReset(formValues);
  }, [formValues, onReset]);

  const handleBack = React.useCallback(() => {
    navigate(backPath ?? '/alunos');
  }, [navigate, backPath]);

  const handleTextFieldChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange('nome', e.target.value);
    },
    [onFieldChange]
  );

  const handleCheckboxChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      onFieldChange('mulher', checked);
    },
    [onFieldChange]
  );

  return (
    <Box className='bg-gray-900 p-7 rounded-2xl'
      component="form"
      onSubmit={handleSubmit}
      onReset={handleReset}
      sx={{ width: "100%", maxWidth: 600, mx: "auto", mt: 25 }}
    >
      <FormGroup>
        <Grid container spacing={2} sx={{ mb: 2, width: '100%' }}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <TextField
              fullWidth
              label="Nome"
              value={formValues.nome}
              onChange={handleTextFieldChange}
              error={!!formErrors.nome}
              helperText={formErrors.nome ?? " "}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 12 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.mulher} fullWidth>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.mulher}
                    onChange={handleCheckboxChange}
                  />
                }
                label="Mulher?"
              />
              <FormHelperText>{formErrors.mulher ?? " "}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </FormGroup>

      <Stack direction="row" spacing={2} sx={{ mt: 4 }} justifyContent="space-between">
        {backPath && (
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
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
