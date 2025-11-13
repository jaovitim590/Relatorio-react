import { API_URL } from "./api";

export const relatorioService = {
  relatorioByNome: async (nome: string) => {
    try{
    const response = await fetch(`${API_URL}/relatorio/buscar/${encodeURIComponent(nome)}`,{
      method: "GET",
      headers:{
        "Content-Type": "application/json",
        } 
      }
    );

    if (!response.ok){
      throw new Error(`Erro ao buscar relatório (${response.status})`);
    }
    
    const data = await response.json()
    return data

  }catch (error){
    console.log("erro no fetch", error)
    throw error
  }
},
  relatorioById: async(id: number) => {
    try{
      const response = await fetch(`${API_URL}/relatorio/${encodeURIComponent(id)}`,{
      method: "GET",
      headers:{
        "Content-Type": "application/json",
        } 
      }
      
    );
    if (!response.ok){
      throw new Error(`Erro ao buscar relatório (${response.status})`);
    }
    
    const data = await response.json()
    return data
    
    }catch (error){
    console.log("erro no fetch", error)
    throw error
  }
  }
} 
