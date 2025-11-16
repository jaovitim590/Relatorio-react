import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../service/api";
import AlunoForm from "./AlunoForm";

interface AlunoValues {
  nome: string;
  mulher: boolean;
}

export default function AlunoCreate() {
  const navigate = useNavigate();
  const [values, setValues] = useState<AlunoValues>({ nome: "", mulher: false });

  const handleChange = (field: keyof AlunoValues, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${API_URL}/aluno`, values);
      navigate("/dashboard/alunos");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col justify-center items">
      <h2 className="text-4xl text-center py-12">Criar aluno</h2>
      <AlunoForm
                formState={{ values, errors: {} }}
                onFieldChange={handleChange}
                onSubmit={handleSubmit}
                backPath="/dashboard/alunos"
                submitLabel="Salvar"
              />
    </div>
  );
}
