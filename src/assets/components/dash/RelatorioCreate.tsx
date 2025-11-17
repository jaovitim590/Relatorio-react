import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { relatorioService } from "../../../service/relatorioService";
import { alunoService } from "../../../service/alunoService";
import RelatorioForm, { type AlunoRef, type RelatorioFormState } from "./RelatorioForm";

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
      navigate("/dashboard/relatorios");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-4xl text-center py-12">Criar Relatório</h2>
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