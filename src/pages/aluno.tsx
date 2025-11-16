import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "../assets/components/Header";
import { Data } from "../assets/components/Data";
import { relatorioService } from "../service/relatorioService";

type Relatorio = {
  id: number;
  dia: string;
  aluno: {
    id: number;
    nome: string;
    mulher: boolean;
  };
};

const formatarData = (dataStr: string) => {
  const data = new Date(`${dataStr}T12:00:00`);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  });
};

export const Aluno = () => {
  const { aluno } = useParams<{ aluno: string }>();
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatorio = async () => {
      try {
        const data = await relatorioService.relatorioByNome(aluno || "");
        setRelatorios(data);
      } catch (error) {
        setErro("Erro ao carregar relatório");
        console.error(error);
      }
    };

    if (aluno) fetchRelatorio();
  }, [aluno]);

  if (erro) {
    return (
      <div className="text-white text-center mt-10">
        <h1>{erro}</h1>
        <Link to="/" className="underline">Voltar</Link>
      </div>
    );
  }

  if (relatorios.length === 0) {
    return (
      <div className="text-white text-center mt-10">
        <h1>Carregando relatório...</h1>
      </div>
    );
  }

  const info = relatorios[0].aluno;

  return (
    <>
      <Header nome={""} />
      <header className="pb-20 bg-gray-950 min-h-screen text-white outfit">
        <h1 className="text-center titulo text-4xl p-8">{info.nome}</h1>

        <section className="flex flex-col items-center gap-6">
          {relatorios.map((relatorio) => (
            <Data key={relatorio.id} id={relatorio.id} dia={formatarData(relatorio.dia)} />
          ))}
        </section>
      </header>
    </>
  );
};
