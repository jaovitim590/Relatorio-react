import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { relatorioService } from "../service/relatorioService";
import { Header } from "../assets/components/Header";

type Relatorio = {
  id: number;
  dia: string;
  observacao: string;
  repertorio: string;
  escalas: string;
  aluno: {
    id: number;
    nome: string;
    mulher: boolean;
  };
};

function extrairEscalas(texto: string): { chave: string; valor: string }[] {
  if (!texto) return [];

  const limpo = texto
    .replace(/•/g, "")           
    .replace(/\r/g, "")        
    .replace(/\n+/g, " ")    
    .replace(/\s+/g, " ")      
    .trim();

  const regex = /([A-ZÀ-Ý][^:]{0,120}?):\s*([^:]+?)(?=(?:\s+[A-ZÀ-Ý][^:]{0,120}:\s)|$)/g;

  const matches: { chave: string; valor: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(limpo)) !== null) {
    matches.push({ chave: m[1].trim(), valor: m[2].trim() });
  }

  if (matches.length === 0) {
    return [{ chave: "Escalas", valor: limpo }];
  }

  return matches;
}

export const Relatorio = () => {
  const { id } = useParams<{ id: string }>();
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatorio = async () => {
      try {
        const data = await relatorioService.relatorioById(Number(id));
        setRelatorio(data);
      } catch (error) {
        console.error(error);
        setErro("Erro ao carregar relatório");
      }
    };
    if (id) fetchRelatorio();
  }, [id]);

  if (erro)
    return (
      <div className="text-white text-center mt-10">
        <h1>{erro}</h1>
        <Link to="/" className="underline">
          Voltar
        </Link>
      </div>
    );

  if (!relatorio)
    return (
      <div className="text-white text-center mt-10">
        <h1>Carregando relatório...</h1>
      </div>
    );


  return (
    <>
      <Header nome="" />
      <main className="text-white p-8 bg-gray-950 min-h-screen flex flex-col items-center justify-center outfit">
        <h1 className="text-center titulo text-4xl mb-8">
          {relatorio.aluno.nome}
        </h1>

        <section className="bg-white text-black w-full max-w-3xl rounded-3xl p-8 shadow-lg text-1xl">
          <p className="text-2xl">
            <strong>Dia:</strong>{" "}
            {new Date(relatorio.dia).toLocaleDateString("pt-BR")}
          </p>

          <div className="mt-4">
            <strong>Repertório:</strong>
            <ul className="list-disc ml-8">
              {relatorio.repertorio
                .split(/(?=\d+\.\s?)/)
                .map((item, i) => {
                  const texto = item.trim();
                  return texto ? <li key={i}>{texto}</li> : null;
                })}
            </ul>
          </div>

          <div className="mt-4">
              <strong>Escalas:</strong>
              <ul className="list-disc ml-6 mt-2">
                {extrairEscalas(relatorio.escalas).map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.chave}:</strong> {item.valor}
                  </li>
                ))}
              </ul>
            </div>

          <p className="mt-4">
            <strong>Observação:</strong> {relatorio.observacao}
          </p>
        </section>

        <div className="text-center mt-8">
          <Link
            to={`/${relatorio.aluno.nome}`}
            className="bg-indigo-400 text-white rounded-2xl px-6 py-2 duration-300 hover:scale-110 hover:bg-indigo-300 font-medium"
          >
            Voltar
          </Link>
        </div>
      </main>
    </>
  );
};
