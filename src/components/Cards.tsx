import { Link } from "react-router-dom"

export const Cards = () => {
  return (
    <main className="w-full flex flex-col items-center text-white mt-6">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Escolha o aluno</h1>
      </div>

      <section className="flex flex-col gap-5 py-7 hover:gap-8 transition-all duration-300">
        <Card name="first" homem={true} />
        <Card name="second" homem={false} />
        <Card name="third" homem={true} />
        <Card name="forth" homem={false} />
      </section>
    </main>
  )
}

type CardProps = {
  name: string;
  homem: boolean;
}

const Card = ({name, homem}: CardProps) => {
  return (
    <Link to={`/${name}`}><section className="flex justify-between bg-gray-700 items-center rounded-2xl duration-300 hover:scale-110 hover:group-hover:gap-8 w-80 shadow-white shadow-xs hover:shadow-xl">
    <div className="p-5 rounded-2xl flex flex-col items-start text-left justify-center gap-3 w-48">
      <img
        src={homem ? "/man.png" : "/woman.png"}
        alt={homem ? "Homem" : "Mulher"}
        className="w-10"
      />
      <h1 className="text-lg font-medium">{name}</h1>
    </div>

    <div className="p-5">
      <button className="bg-gray-800 rounded-2xl w-24 h-8 duration-200 hover:font-bold hover:scale-110">Selecione</button>
    </div>
    </section></Link>
  )
}
