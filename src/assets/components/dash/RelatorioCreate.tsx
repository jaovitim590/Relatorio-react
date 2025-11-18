import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { relatorioService } from "../../../service/relatorioService";
import { alunoService } from "../../../service/alunoService";
import RelatorioForm, { type AlunoRef, type RelatorioFormState } from "./RelatorioForm";

// Chave única para salvar no localStorage
const DRAFT_STORAGE_KEY = "relatorio_draft";

export default function RelatorioCreate() {
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState<AlunoRef[]>([]);
  const [formState, setFormState] = useState<RelatorioFormState>({
    values: {
      aluno_id: null,
      dia: "",
      observacao: "",
      escalas: "",
      repertorio: "",
    },
    errors: {},
  });
  const [showRecoverMessage, setShowRecoverMessage] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Carregar lista de alunos
  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const data = await alunoService.getAlunos();
        setAlunos(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAlunos();
  }, []);

  // Verificar se existe um rascunho salvo ao montar o componente
  useEffect(() => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        // Verifica se há dados preenchidos
        const hasData =
          parsed.data.dia ||
          parsed.data.observacao ||
          parsed.data.escalas ||
          parsed.data.repertorio ||
          parsed.data.aluno_id;

        if (hasData) {
          setShowRecoverMessage(true);
        }
      } catch (error) {
        console.error("Erro ao recuperar rascunho:", error);
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    }
  }, []);

  // Auto-save: salva no localStorage quando o formulário muda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Verifica se há algum dado preenchido
      const hasData =
        formState.values.dia ||
        formState.values.observacao ||
        formState.values.escalas ||
        formState.values.repertorio ||
        formState.values.aluno_id;

      if (hasData) {
        const draftData = {
          data: {
            aluno_id: formState.values.aluno_id,
            dia: formState.values.dia,
            observacao: formState.values.observacao,
            escalas: formState.values.escalas,
            repertorio: formState.values.repertorio,
          },
          timestamp: new Date().toISOString(),
        };

        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
        setLastSaved(new Date());
      }
    }, 1000); // Salva 1 segundo após parar de digitar

    return () => clearTimeout(timeoutId);
  }, [formState.values]);

  // Aviso antes de sair da página (previne perda acidental)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasData =
        formState.values.dia ||
        formState.values.observacao ||
        formState.values.escalas ||
        formState.values.repertorio ||
        formState.values.aluno_id;

      if (hasData) {
        e.preventDefault();
        e.returnValue = "Você tem alterações não salvas. Deseja realmente sair?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formState.values]);

  // Função para recuperar o rascunho salvo
  const handleRecoverDraft = () => {
    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        
        // Recupera o aluno salvo (precisa encontrar o objeto completo na lista)
        let alunoRecuperado: AlunoRef | null = null;
        if (parsed.data.aluno_id) {
          alunoRecuperado = alunos.find(
            (aluno) => aluno.id === parsed.data.aluno_id?.id
          ) || parsed.data.aluno_id;
        }

        setFormState((prev) => ({
          ...prev,
          values: {
            aluno_id: alunoRecuperado,
            dia: parsed.data.dia || "",
            observacao: parsed.data.observacao || "",
            escalas: parsed.data.escalas || "",
            repertorio: parsed.data.repertorio || "",
          },
        }));
        setShowRecoverMessage(false);
      } catch (error) {
        console.error("Erro ao recuperar rascunho:", error);
        alert("Erro ao recuperar rascunho salvo.");
      }
    }
  };

  // Função para descartar o rascunho
  const handleDiscardDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setShowRecoverMessage(false);
  };

  const handleFieldChange = (
    field: keyof RelatorioFormState["values"],
    value: string | AlunoRef | null
  ) => {
    setFormState((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
    }));
  };

  const handleSubmit = async (values: RelatorioFormState["values"]) => {
    if (!values.aluno_id) {
      alert("Selecione um aluno!");
      return;
    }

    try {
      await relatorioService.criarRelatorio({
        aluno_id: values.aluno_id.id,
        dia: values.dia,
        observacao: values.observacao,
        escalas: values.escalas,
        repertorio: values.repertorio,
      });

      // Limpa o rascunho após salvar com sucesso
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      
      navigate("/dashboard/relatorios");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar relatório. Seus dados foram salvos automaticamente.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-4xl text-center py-12">Criar Relatório</h2>

      {/* Mensagem de rascunho encontrado */}
      {showRecoverMessage && (
        <div className="w-full max-w-2xl mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-blue-600 mt-0.5 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-1">
                Rascunho encontrado
              </h3>
              <p className="text-sm text-blue-700 mb-3">
                Encontramos um rascunho salvo anteriormente. Deseja recuperá-lo?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleRecoverDraft}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Recuperar Rascunho
                </button>
                <button
                  onClick={handleDiscardDraft}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
                >
                  Descartar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Indicador de salvamento automático */}
      {lastSaved && (
        <div className="w-full max-w-2xl mb-4 text-sm text-gray-600 flex items-center justify-end gap-2">
          <svg
            className="w-4 h-4 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>
            Salvo automaticamente às {lastSaved.toLocaleTimeString("pt-BR")}
          </span>
        </div>
      )}

      <RelatorioForm
        formState={formState}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        backPath="/dashboard/relatorios"
        submitLabel="Salvar"
        alunos={alunos}
      />

      {/* Dica sobre auto-save */}
      <div className="w-full max-w-2xl mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
        <p className="text-sm text-gray-600">
          <strong>💡 Dica:</strong> Seus dados são salvos automaticamente a cada
          segundo. Você pode sair e voltar a qualquer momento sem perder seu
          progresso.
        </p>
      </div>
    </div>
  );
}