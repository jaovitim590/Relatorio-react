import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AlunoForm, { type AlunoFormState } from "./AlunoForm";
import { alunoService } from "../../../service/alunoService";

export default function AlunoEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formState, setFormState] = useState<AlunoFormState>({
    values: { nome: "", mulher: false },
    errors: {},
  });

  useEffect(() => {
  const fetchAluno = async () => {
    try {
      const data = await alunoService.getAlunoById(Number(id)); // ← usar service
      setFormState((prev) => ({
        ...prev,
        values: {
          nome: data.nome ?? "",
          mulher: !!data.mulher,
        },
      }));
    } catch (err) {
      console.error(err);
    }
  };
  fetchAluno();
}, [id]);

  const handleFieldChange = (field: keyof AlunoFormState["values"], value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
    }));
  };

  const handleSubmit = async (values: AlunoFormState["values"]) => {
    try {
      await alunoService.atualizarAluno(Number(id), values); // ← usar service
      navigate("/dashboard/alunos");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h2 className="text-4xl text-center py-12">Editar Aluno</h2>
      <AlunoForm
        formState={formState}            
        onFieldChange={handleFieldChange}
        onSubmit={handleSubmit}        
        backPath="/dashboard/alunos"
        submitLabel="atualizar"
      />
    </div>
  );
}
