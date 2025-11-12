import { useAuth } from "../context/AuthContext";

export const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-2xl mb-4">Bem-vindo, {user}!</h1>
      <button
        onClick={logout}
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-400"
      >
        Sair
      </button>
    </div>
  );
};
