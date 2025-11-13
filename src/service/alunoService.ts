import { API_URL } from "./api";

export const alunoSerice={
  getAlunos: async () =>{
    try{
      const response = await fetch(`${API_URL}/aluno`,{
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        }
      })

      if (!response.ok){
        throw new Error(`Erro ao buscar alunos (${response.status})`);
      }

      const data = await response.json()
      return data

    }catch (error){
      console.log("erro no fetch de aluno", error)
      throw error
    }
  }
}