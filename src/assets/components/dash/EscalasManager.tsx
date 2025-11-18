import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

interface Escala {
  id: string;
  nome: string;
  conteudo: string;
}

interface EscalasManagerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function EscalasManager({ value, onChange }: EscalasManagerProps) {
  const parseEscalas = (str: string): Escala[] => {
    if (!str || str.trim() === "") return [];
    
    try {
      const escalasArray = str.split(";").filter(e => e.trim());
      return escalasArray.map((escalaStr, index) => {
        const match = escalaStr.match(/ESCALA:(.+?)\|(.+)/);
        if (match) {
          return {
            id: `escala-${Date.now()}-${index}`,
            nome: match[1].trim(),
            conteudo: match[2].trim(),
          };
        }
        return {
          id: `escala-${Date.now()}-${index}`,
          nome: "",
          conteudo: escalaStr.trim(),
        };
      });
    } catch (error) {
      console.error("Erro ao parsear escalas:", error);
      return [];
    }
  };

  const stringifyEscalas = (escalas: Escala[]): string => {
    return escalas
      .filter(e => e.nome.trim() || e.conteudo.trim())
      .map(e => `ESCALA:${e.nome.trim()}|${e.conteudo.trim()}`)
      .join(";");
  };

  const [escalas, setEscalas] = useState<Escala[]>(() => parseEscalas(value));

  const updateEscalas = (newEscalas: Escala[]) => {
    setEscalas(newEscalas);
    onChange(stringifyEscalas(newEscalas));
  };

  const addEscala = () => {
    const newEscala: Escala = {
      id: `escala-${Date.now()}`,
      nome: "",
      conteudo: "",
    };
    updateEscalas([...escalas, newEscala]);
  };

  const removeEscala = (id: string) => {
    updateEscalas(escalas.filter(e => e.id !== id));
  };

  const updateEscala = (id: string, field: "nome" | "conteudo", value: string) => {
    updateEscalas(
      escalas.map(e => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
          Escalas
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={addEscala}
          sx={{ 
            textTransform: "none",
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.dark",
            }
          }}
        >
          Add Escala
        </Button>
      </Stack>

      {escalas.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "rgba(255, 255, 255, 0.03)",
            border: "2px dashed rgba(255, 255, 255, 0.1)",
            borderRadius: 1,
            boxShadow: "none",
          }}
        >
          <MusicNoteIcon 
            sx={{ 
              fontSize: 48, 
              color: "rgba(255, 255, 255, 0.2)", 
              mb: 2 
            }} 
          />
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.5)" }} gutterBottom>
            Nenhuma escala adicionada ainda
          </Typography>
          <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.3)" }}>
            Clique em "Add Escala" para começar
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {escalas.map((escala, index) => (
            <Paper
              key={escala.id}
              elevation={0}
              sx={{
                p: { xs: 2, sm: 3 },
                bgcolor: "rgba(255, 255, 255, 0.03)",
                borderRadius: 1,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "none",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ 
                    color: "primary.main", 
                    fontWeight: 600 
                  }}
                >
                  Escala #{index + 1}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => removeEscala(escala.id)}
                  sx={{ 
                    color: "error.main",
                    "&:hover": {
                      bgcolor: "rgba(244, 67, 54, 0.1)",
                    }
                  }}
                  aria-label="Remover escala"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Nome da Escala"
                  value={escala.nome}
                  onChange={(e) => updateEscala(escala.id, "nome", e.target.value)}
                  placeholder="Ex: Escala de Dó Maior"
                  size="small"
                  sx={{
                    "& .MuiInputBase-root": {
                      bgcolor: "transparent",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.15)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.25)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Conteúdo da Escala"
                  value={escala.conteudo}
                  onChange={(e) => updateEscala(escala.id, "conteudo", e.target.value)}
                  placeholder="Ex: Dó, Ré, Mi, Fá, Sol, Lá, Si, Dó"
                  multiline
                  minRows={3}
                  maxRows={8}
                  sx={{ 
                    "& .MuiInputBase-root": { 
                      alignItems: "flex-start",
                      bgcolor: "transparent",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.15)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(255, 255, 255, 0.25)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "primary.main",
                      },
                    },
                  }}
                />
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      {escalas.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <details>
            <summary
              style={{
                cursor: "pointer",
                fontSize: "0.75rem",
                color: "rgba(255, 255, 255, 0.4)",
                userSelect: "none",
              }}
            >
              🔍 Ver formato que será salvo no banco
            </summary>
            <Paper
              elevation={0}
              sx={{
                mt: 1,
                p: 2,
                bgcolor: "rgba(255, 255, 255, 0.03)",
                borderRadius: 1,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                overflow: "auto",
                boxShadow: "none",
              }}
            >
              <Typography
                variant="caption"
                component="pre"
                sx={{
                  fontFamily: "monospace",
                  fontSize: "0.7rem",
                  color: "rgba(255, 255, 255, 0.5)",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                {stringifyEscalas(escalas) || "(vazio)"}
              </Typography>
            </Paper>
          </details>
        </Box>
      )}
    </Box>
  );
}