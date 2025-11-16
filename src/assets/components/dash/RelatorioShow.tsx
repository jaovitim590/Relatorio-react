import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../service/api";

interface Relatorio {
  id: number;
  descricao: string;
  data: string;
}

export default function RelatorioShow() {
  const { id } = useParams<{ id: string }>();

  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`${API_URL}/relatorio/${id}`)
      .then((res) => setRelatorio(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!relatorio) return <p>Carregando...</p>;

  return (
    <div>
      <h2>Relatório #{relatorio.id}</h2>

      <p>
        <strong>Descrição:</strong> {relatorio.descricao}
      </p>

      <p>
        <strong>Data:</strong> {relatorio.data}
      </p>

      <Link to={`/dashboard/relatorios/${id}/edit`}>Editar</Link>
    </div>
  );
}
