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

// Detecta se o texto parece ser de escalas
function isEscalaContent(texto: string): boolean {
  if (!texto) return false;
  const patterns = [
    /escala de (dó|ré|mi|fá|sol|lá|si)/i,
    /arpejo/i,
    /maior|menor/i,
    /ESCALA:/,
  ];
  return patterns.filter(p => p.test(texto)).length >= 2;
}

// Detecta se o texto parece ser repertório (músicas)
function isRepertorioContent(texto: string): boolean {
  if (!texto) return false;
  const patterns = [
    /['"][\w\s]+['"]/,  // Texto entre aspas
    /tocada|executada/i,
    /música|musette|minueto|gavotte|remando|trumpet/i,
    /^\d+\./m, // Começa com número
  ];
  return patterns.filter(p => p.test(texto)).length >= 2;
}

// Detecta se o texto parece ser observação geral
function isObservacaoContent(texto: string): boolean {
  if (!texto) return false;
  const patterns = [
    /demonstrou|obteve|precisa melhorar|teve|apresentou/i,
    /desempenho|evolução|progresso/i,
  ];
  return patterns.filter(p => p.test(texto)).length >= 1;
}

// Formata escalas do formato antigo para legível
function formatarEscalas(texto: string): string {
  if (!texto || texto.trim() === "") return "";
  
  // Formato ESCALA:nome|status;
  if (texto.includes("ESCALA:") && texto.includes("|")) {
    try {
      const escalas = texto
        .split(";")
        .filter(e => e.trim())
        .map((escalaStr) => {
          const match = escalaStr.match(/ESCALA:(.+?)\|(.+)/);
          if (match) {
            return `• ${match[1].trim()}: ${match[2].trim()}`;
          }
          return null;
        })
        .filter(e => e !== null);

      return escalas.length > 0 ? escalas.join("\n") : texto;
    } catch (error) {
      console.error("Erro ao formatar escalas:", error);
    }
  }
  
  return texto;
}

// Formata texto removendo bullets estranhos e melhorando legibilidade
function formatarTexto(texto: string): string {
  if (!texto) return "";
  
  return texto
    .replace(/•/g, "\n• ") // Adiciona quebra antes de bullets
    .replace(/(\d+)\.\s*/g, "\n$1. ") // Adiciona quebra antes de números
    .replace(/^\s+/gm, "") // Remove espaços no início das linhas
    .replace(/\n{3,}/g, "\n\n") // Remove quebras excessivas
    .trim();
}

export const Relatorio = () => {
  const { id } = useParams<{ id: string }>();
  const [relatorio, setRelatorio] = useState<Relatorio | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const fetchRelatorio = async () => {
      try {
        const data = await relatorioService.getRelatorioById(Number(id));
        
        let observacao = data.observacao;
        let escalas = data.escalas;
        let repertorio = data.repertorio;
        
        // Detecta e corrige campos trocados (relatórios antigos)
        const obsIsEscala = isEscalaContent(observacao);
        const escIsRepertorio = isRepertorioContent(escalas);
        const repIsObservacao = isObservacaoContent(repertorio);
        
        // Padrão: obs=escalas, esc=repertorio, rep=observacao → corrige
        if (obsIsEscala && escIsRepertorio && repIsObservacao) {
          const temp = observacao;
          observacao = repertorio; // observacao real estava em repertorio
          repertorio = escalas;    // repertorio real estava em escalas
          escalas = temp;          // escalas reais estavam em observacao
        }
        
        setRelatorio({
          ...data,
          observacao: formatarTexto(observacao),
          escalas: formatarEscalas(escalas) || formatarTexto(escalas),
          repertorio: formatarTexto(repertorio),
        });
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

        <section className="bg-white text-black w-full max-w-3xl rounded-3xl p-8 shadow-lg">
          {/* Data */}
          <div className="mb-6 pb-4 border-b-2 border-gray-200">
            <p className="text-2xl">
              <strong className="text-indigo-600">Dia:</strong>{" "}
              {new Date(relatorio.dia).toLocaleDateString("pt-BR", { timeZone: "UTC" })}
            </p>
          </div>

          {/* Observação */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-indigo-600 mb-3">📝 Observação Geral</h3>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border-l-4 border-indigo-400 shadow-sm">
              <p className="whitespace-pre-line leading-relaxed text-gray-800">
                {relatorio.observacao || "Nenhuma observação registrada"}
              </p>
            </div>
          </div>

          {/* Escalas */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-purple-600 mb-3">🎵 Escalas Trabalhadas</h3>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl border-l-4 border-purple-400 shadow-sm">
              <p className="whitespace-pre-line leading-relaxed text-gray-800">
                {relatorio.escalas || "Nenhuma escala registrada"}
              </p>
            </div>
          </div>

          {/* Repertório */}
          <div>
            <h3 className="text-xl font-bold text-green-600 mb-3">🎼 Repertório</h3>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border-l-4 border-green-400 shadow-sm">
              <p className="whitespace-pre-line leading-relaxed text-gray-800">
                {relatorio.repertorio || "Nenhum repertório registrado"}
              </p>
            </div>
          </div>
        </section>

        <div className="text-center mt-8">
          <Link
            to={`/${relatorio.aluno.nome}`}
            className="bg-indigo-400 text-white rounded-2xl px-6 py-2 duration-300 hover:scale-110 hover:bg-indigo-300 font-medium inline-block"
          >
            Voltar
          </Link>
        </div>
      </main>
    </>
  );
};