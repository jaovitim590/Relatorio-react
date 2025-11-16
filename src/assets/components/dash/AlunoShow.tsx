import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../service/api";

export default function AlunoShow() {
  const { alunoId } = useParams();
  const [aluno, setAluno] = useState<any>(null);

  useEffect(() => {
    axios.get(`${API_URL}+/aluno/${alunoId}`)
      .then(res => setAluno(res.data))
      .catch(err => console.error(err));
  }, []);

  if (!aluno) return <p>Carregando...</p>;

  return (
    <div>
      <h2>Aluno #{aluno.id}</h2>
      <p><strong>Nome:</strong> {aluno.nome}</p>
      <p><strong>Mulher:</strong> {aluno.mulher ? "Não" : "Sim"}</p>

      <Link to={`/alunos/${aluno.id}/edit`}>Editar</Link>
    </div>
  );
}
