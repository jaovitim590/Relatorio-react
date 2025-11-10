import { Link } from "react-router-dom";

type Rota= {
  nome: string
}

export const Header = ({nome}: Rota) => {
    const labelBt = nome === "" ? "Voltar" : "Dash";

  return (
    <header>
      <div className="py-4 px-6 md:px-8 w-full m-auto bg-gray-900 text-white flex flex-row md:flex-row justify-between items-center gap-4">
        <section className="flex gap-4 items-center justify-center md:justify-start">
          <h1 className="text-xl md:text-3xl duration-300 hover:scale-105 hover:text-purple-500 shake text-center md:text-left titulo">
            Manuella Barbosa
          </h1>
        </section>
        <section>
          <Link to={`/${nome}`}><button className="bg-indigo-400 text-white rounded-2xl px-6 md:px-8 py-2 duration-300 hover:cursor-pointer hover:bg-indigo-300 w-full md:w-auto font-medium hover:scale-110 hover:font-bold">
            {labelBt}
          </button></Link>
        </section>
      </div>
    </header>
  )
}
