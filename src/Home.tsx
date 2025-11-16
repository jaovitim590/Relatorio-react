import { Header } from "./assets/components/Header"
import { Cards } from "./assets/components/Cards";

export function Home(){
  return (
    <div className="pb-20 bg-gray-950 min-h-screen text-white outfit">
      <Header nome="login" />
      <Cards />
    </div>
  )
}