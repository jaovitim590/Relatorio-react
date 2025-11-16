import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../service/api";
import { useNavigate } from "react-router-dom";
import RelatorioForm, { type RelatorioFormState, type AlunoRef } from "./RelatorioForm";

export default function RelatorioCreate() {
  const navigate = useNavigate();

  const [alunos, setAlunos] = useState<AlunoRef[]>([]);
  const [formState, setFormState] = useState<RelatorioFormState>({
    values: {
      aluno_id: null,
      data: "",
      observacao: "",
      escalas: "",
      repertorio: "",
    },
    errors: {},
  });
  const [loadingAlunos, setLoadingAlunos] = useState(true);

  // Busca alunos do backend (com mounted flag para evitar setState após unmount)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingAlunos(true);
        const res = await axios.get(`${API_URL}/aluno`);
        if (!mounted) return;
        setAlunos(res.data ?? []);
      } catch (err) {
        console.error("Erro ao carregar alunos:", err);
      } finally {
        if (mounted) setLoadingAlunos(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleFieldChange = (
    field: keyof RelatorioFormState["values"],
    value: string | AlunoRef | null
  ) => {
    setFormState(prev => {
      if (!prev) return prev;
      const newValues = { ...prev.values };
      if (field === "aluno_id") {
        newValues.aluno_id = value as AlunoRef | null;
      } else {
        newValues[field as Exclude<keyof RelatorioFormState["values"], "aluno_id">] = String(value ?? "");
      }
      return { ...prev, values: newValues };
    });
  };

  const handleSubmit = async (values: RelatorioFormState["values"]) => {
    try {
      // Normaliza aluno_id para número ou null
      const alunoIdPayload =
        values.aluno_id == null
          ? null
          : typeof values.aluno_id === "object"
          ? values.aluno_id.id
          : Number(values.aluno_id);

      // Monta payload. Sua API no relatorio retornou "dia" para a data,
      // então enviamos "dia" no payload (YYYY-MM-DD esperado pelo input[type=date]).
      const payload: any = {
        observacao: values.observacao,
        escalas: values.escalas,
        repertorio: values.repertorio,
        aluno_id: alunoIdPayload,
      };

      if (values.data) {
        payload.dia = values.data;
      }

      await axios.post(`${API_URL}/relatorio/salvar`, payload);
      navigate("/dashboard/relatorios");
    } catch (err: any) {
      console.error("Erro ao salvar relatório:", err);

      // Se API retornar erros de validação estruturados, mapeia para formState.errors
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors && typeof apiErrors === "object") {
        const mappedErrors: RelatorioFormState["errors"] = {};
        Object.keys(apiErrors).forEach((k) => {
          const primeiro = apiErrors[k]?.[0] ?? apiErrors[k];
          (mappedErrors as any)[k] = String(primeiro);
        });
        setFormState(prev => prev ? ({ ...prev, errors: mappedErrors }) : prev);
      }
    }
  };

  // opcional: enquanto carrega alunos você pode mostrar loading.
  // RelatorioForm funciona mesmo com lista vazia, mas é bom esperar se preferir.
  if (loadingAlunos) return <p>Carregando...</p>;

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-4xl text-center py-12">Criar relatório</h2>
      <RelatorioForm
        formState={formState}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        backPath="/dashboard/relatorios"
        submitLabel="Salvar"
        alunos={alunos} // <<< importante: passou a lista de alunos para o select
      />
    </div>
  );
}