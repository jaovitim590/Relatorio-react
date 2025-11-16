import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../service/api";
import AlunoForm, { type AlunoFormState } from "./AlunoForm";

export default function AlunoEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formState, setFormState] = useState<AlunoFormState>({
    values: { nome: "", mulher: false },
    errors: {},
  });

  useEffect(() => {
  axios
    .get(`${API_URL}/aluno/${id}`)
    .then((res) => {
      const data = res.data as { nome: string; mulher: boolean }; 
      setFormState((prev) => ({
        ...prev,
        values: {
          nome: data.nome ?? "",
          mulher: !!data.mulher,
        },
      }));
    })
    .catch((err) => console.error(err));
}, [id]);

  const handleFieldChange = (field: keyof AlunoFormState["values"], value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
    }));
  };

  const handleSubmit = async (values: AlunoFormState["values"]) => {
    try {
      await axios.patch(`${API_URL}/aluno/update/${id}`, values);
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
        submitLabel="Salvar"
      />
    </div>
  );
}
