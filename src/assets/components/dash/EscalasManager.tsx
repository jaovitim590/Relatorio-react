import { useState, useEffect } from "react";
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
    
    console.log('📥 Parseando escalas. Valor recebido:', str);
    
    try {
      // Formato novo: ESCALA:nome|conteudo;ESCALA:nome2|conteudo2
      if (str.includes("ESCALA:") && str.includes("|")) {
        console.log('✅ Detectado formato novo');
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
      }

      console.log('⚠️ Formato antigo detectado, tentando parsear...');
      
      // Formato antigo: tenta extrair usando regex (padrão: Nome: conteudo)
      let limpo = str
        .replace(/•/g, "")
        .replace(/\r/g, "")
        .trim();

      // Remove prefixos comuns como "Escalas:" no início
      limpo = limpo.replace(/^Escalas:\s*/i, "");
      limpo = limpo.replace(/^Repertório:\s*/i, "");

      console.log('🧹 Texto limpo:', limpo);

      // Tenta parsear formato com aspas: 1. 'Nome': descrição
      const regexAspas = /\d+\.\s*'([^']+)':\s*([^']+?)(?=\d+\.\s*'|$)/g;
      let matches: Escala[] = [];
      let m: RegExpExecArray | null;
      let index = 0;

      while ((m = regexAspas.exec(limpo)) !== null) {
        const nome = m[1].trim();
        const conteudo = m[2].trim().replace(/\.\s*$/, "");
        
        if (nome && conteudo) {
          matches.push({
            id: `escala-${Date.now()}-${index}`,
            nome: nome,
            conteudo: conteudo,
          });
          index++;
        }
      }

      if (matches.length > 0) {
        console.log('✅ Escalas parseadas do formato numerado com aspas:', matches.length);
        console.log('📝 Matches:', matches);
        return matches;
      }

      // Fallback: formato padrão Nome: descrição
      limpo = limpo.replace(/\n+/g, " ").replace(/\s+/g, " ");
      const regex = /([A-ZÀ-Ý][^:]{0,120}?):\s*([^:]+?)(?=(?:\s+[A-ZÀ-Ý][^:]{0,120}:\s)|$)/g;
      index = 0;

      while ((m = regex.exec(limpo)) !== null) {
        const nome = m[1].trim();
        const conteudo = m[2].trim();
        
        // Ignora entradas vazias ou muito curtas
        if (nome && conteudo && nome.length > 1) {
          matches.push({
            id: `escala-${Date.now()}-${index}`,
            nome: nome,
            conteudo: conteudo,
          });
          index++;
        }
      }

      console.log('📝 Matches encontrados:', matches);

      if (matches.length > 0) {
        console.log('✅ Escalas parseadas do formato antigo:', matches.length);
        return matches;
      }

      console.log('⚠️ Não conseguiu parsear com regex, retornando como escala única');
      
      // Se não conseguiu parsear, retorna como uma única escala sem nome
      return [{
        id: `escala-${Date.now()}-0`,
        nome: "",
        conteudo: limpo,
      }];
    } catch (error) {
      console.error("❌ Erro ao parsear escalas:", error);
      return [];
    }
  };

  const stringifyEscalas = (escalas: Escala[]): string => {
    return escalas
      .filter(e => e.nome.trim() || e.conteudo.trim())
      .map(e => `ESCALA:${e.nome.trim()}|${e.conteudo.trim()}`)
      .join(";");
  };

  const [escalas, setEscalas] = useState<Escala[]>([]);

  // Atualiza quando o value prop mudar (Ex: quando carrega dados no Edit)
  useEffect(() => {
    console.log('🔄 EscalasManager recebeu novo valor:', value);
    const parsed = parseEscalas(value);
    console.log('📋 Escalas parseadas:', parsed);
    setEscalas(parsed);
  }, [value]);

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