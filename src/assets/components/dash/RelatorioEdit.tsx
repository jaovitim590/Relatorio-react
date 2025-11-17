import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { relatorioService } from "../../../service/relatorioService";
import { alunoService } from "../../../service/alunoService";
import RelatorioForm, { type AlunoRef, type RelatorioFormState } from "./RelatorioForm";

export default function RelatorioEdit() {
  const { id } = useParams<{ id: string }>();
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

  // Carregar dados do relatório
  useEffect(() => {
  const fetchRelatorio = async () => {
    try {
      const data = await relatorioService.getRelatorioById(Number(id));
      setFormState((prev) => ({
        ...prev,
        values: {
          aluno_id: data.aluno || null,
          dia: data.dia || "",
          observacao: data.observacao || "",
          escalas: data.escalas || "",
          repertorio: data.repertorio || "",
        },
      }));
    } catch (err) {
      console.error(err);
    }
  };
  fetchRelatorio();
}, [id]);

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
      await relatorioService.atualizarRelatorio(Number(id), {
        aluno_id: values.aluno_id.id,
        dia: values.dia,
        observacao: values.observacao,
        escalas: values.escalas,
        repertorio: values.repertorio,
      });
      navigate("/dashboard/relatorios");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-4xl text-center py-12">Editar Relatório</h2>
      <RelatorioForm
        formState={formState}
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}
        backPath="/dashboard/relatorios"
        submitLabel="Atualizar"
        alunos={alunos}
      />
    </div>
  );
} 