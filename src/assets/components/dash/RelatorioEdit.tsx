import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../service/api";
import { useParams, useNavigate } from "react-router-dom";
import RelatorioForm, { type RelatorioFormState, type AlunoRef } from "./RelatorioForm";

export default function RelatorioEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [alunos, setAlunos] = useState<AlunoRef[]>([]);
  const [formState, setFormState] = useState<RelatorioFormState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await axios.get(`${API_URL}/aluno`);
        if (!mounted) return;
        setAlunos(res.data || []);
      } catch (err) {
        console.error("Erro ao carregar alunos:", err);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    if (!id) {
      setLoading(false);
      return;
    }

    if (alunos.length === 0) {
      // aguardando lista de alunos para tentar casar o aluno pelo id
      return;
    }

    (async () => {
      try {
        const res = await axios.get(`${API_URL}/relatorio/${id}`);
        if (!mounted) return;
        const data = res.data ?? {};

        // Normaliza aluno_id (pode vir como número, string ou objeto aluno)
        const rawAlunoId = data.aluno_id ?? data.aluno?.id ?? null;
        const alunoIdNum = rawAlunoId == null ? null : Number(rawAlunoId);
        const alunoSelecionado = alunoIdNum == null ? null : (alunos.find(a => a.id === alunoIdNum) ?? null);

        // Normaliza data para YYYY-MM-DD de forma robusta
        // API pode devolver em data.data (timestamp ISO) ou data.dia (string já no formato YYYY-MM-DD)
        const rawDate = data.data ?? data.dia ?? "";
        let dataFormatada = "";
        if (rawDate) {
          try {
            const dt = new Date(rawDate);
            if (!isNaN(dt.getTime())) {
              dataFormatada = dt.toISOString().slice(0, 10);
            } else if (typeof rawDate === "string" && rawDate.includes("T")) {
              dataFormatada = String(rawDate).split("T")[0];
            } else {
              // já está possivelmente em formato YYYY-MM-DD
              dataFormatada = String(rawDate);
            }
          } catch {
            dataFormatada = String(rawDate);
          }
        }

        setFormState({
          values: {
            aluno_id: alunoSelecionado,
            data: dataFormatada,
            observacao: data.observacao ?? "",
            escalas: data.escalas ?? "",
            repertorio: data.repertorio ?? "",
          },
          errors: {},
        });
      } catch (err) {
        console.error("Erro ao carregar relatório:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [id, alunos]);

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
      const alunoIdPayload =
        values.aluno_id == null
          ? null
          : typeof values.aluno_id === "object"
          ? values.aluno_id.id
          : Number(values.aluno_id);

      const payload = {
        ...values,
        aluno_id: alunoIdPayload,
      };

      await axios.patch(`${API_URL}/relatorio/update/${id}`, payload);
      navigate("/dashboard/relatorios");
    } catch (err: any) {
      console.error("Erro ao salvar relatório:", err);
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

  if (loading || !formState) return <p>Carregando...</p>;

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-4xl text-center py-12">Editar relatório</h2>
      <RelatorioForm
        formState={formState}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        backPath="/dashboard/relatorios"
        submitLabel="Salvar"
        alunos={alunos}
      />
    </div>
  );
}