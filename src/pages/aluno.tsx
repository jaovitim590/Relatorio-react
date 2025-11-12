import { useParams, Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Data } from "../components/Data";


let datas= ["2025-11-04","2025-11-03"]

const formatarData = (dataStr: string) => {
  const data = new Date(`${dataStr}T12:00:00`)
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
  })
}

export const Aluno = () => {
  const { aluno } = useParams<{ aluno: string }>();

  const dados = {
    "Giovanna Peres": { nome: "Giovanna Peres", genero: "Feminino" },
    "Julia Cordeiro": { nome: "Julia Cordeiro", genero: "Feminino" },
    "Yasmin Stéfany": { nome: "Yasmin Stéfany", genero: "Feminino" },
    "Alice Gomes": { nome: "Alice Gomes", genero: "Feminino" },
  };

  const info = dados[aluno as keyof typeof dados];

  if (!info) {
    return (
      <div className="text-white text-center mt-10">
        <h1>Aluno não encontrado</h1>
        <Link to="/" className="underline">Voltar</Link>
      </div>
    );
  }

  return (
    <>
      <Header nome="" />
      <header className="pb-20 bg-gray-950 min-h-screen text-white outfit">
        <h1 className="text-center titulo text-4xl p-8" >{info.nome}</h1>
        <section className="flex flex-col items-center gap-6">
          {datas.map((dia, index) => (
            <Data key={index} dia={formatarData(dia)} />
          ))}
          </section>
      </header>
    </>
  );
};
