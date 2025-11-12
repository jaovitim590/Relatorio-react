import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Header } from "../components/Header";
import DarkVeil from "../components/DarkVeil";
import GlareHover from "../components/GlareHover";

export const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="relative bg-gray-950 min-h-screen text-white outfit overflow-hidden flex flex-col">

      <div className="relative z-20">
        <Header nome="" />
      </div>

      <div className="absolute top-0 left-0 w-full h-full z-0">
        <DarkVeil speed={2} warpAmount={5} />
      </div>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center">
        <h1 className="text-center text-4xl mb-6 pb-3.5">Login</h1>

        <section className="flex flex-col items-center gap-7 justify-between ">
          <GlareHover
            background="transparent"
            glareColor="#ffffff"
            glareOpacity={0.4}
            glareAngle={-30}
            glareSize={250}
            transitionDuration={700}
            playOnce={false}
            className="hover:scale-105 duration-200"
            style={
              {
                "--gh-width": "16rem",
                "--gh-height": "3rem",
                "--gh-br": "0.5rem",
              } as React.CSSProperties
            }
          >
            <input
              type="text"
              placeholder="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 w-full h-full rounded text-center bg-transparent border-none outline-none text-white placeholder-gray-400 autofill:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0)]"
            />
          </GlareHover>

          <GlareHover
            background="transparent"
            glareColor="#ffffff"
            glareOpacity={0.6}
            glareAngle={-30}
            glareSize={250}
            transitionDuration={700}
            playOnce={false}
            className="hover:scale-105 duration-200"
            style={
              {
                "--gh-width": "16rem",
                "--gh-height": "3rem",
                "--gh-br": "0.5rem",
              } as React.CSSProperties
            }
          >
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 w-full h-full rounded text-center bg-transparent border-none outline-none text-white placeholder-gray-400 autofill:shadow-[inset_0_0_0px_1000px_rgba(0,0,0,0)]"
            />
          </GlareHover>
        </section>

        <button
          onClick={() => login(username, password)}
          className="mt-6 bg-indigo-500 px-6 py-2 rounded duration-100 hover:bg-indigo-400 transition hover:scale-110 hover:font-bold"
        >
          Entrar
        </button>
      </main>
    </div>
  );
};
