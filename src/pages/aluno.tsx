import { useParams, Link } from "react-router-dom";
import { Header } from "../components/Header";

export const Aluno = () => {
  const { aluno } = useParams<{ aluno: string }>();

  const dados = {
    first: { nome: "Giovanna Peres", genero: "Feminino" },
    second: { nome: "Julia Cordeiro", genero: "Feminino" },
    third: { nome: "Yasmin Stéfany", genero: "Feminino" },
    forth: { nome: "Alice Gomes", genero: "Feminino" },
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
      </header>
    </>
  );
};
