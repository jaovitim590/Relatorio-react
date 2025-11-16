import axios from "axios";
import { API_URL } from "./api";

export const relatorioService = {
  relatorioByNome: async (nome: string) => {
    try {
      const response = await axios.get(`${API_URL}/relatorio/buscar/${encodeURIComponent(nome)}`);
      return response.data; // axios já retorna o JSON em data
    } catch (error) {
      console.error("Erro ao buscar relatório por nome:", error);
      throw error;
    }
  },

  relatorioById: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/relatorio/${encodeURIComponent(id)}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar relatório ${id}:`, error);
      throw error;
    }
  },

  criarRelatorio: async (relatorio: any) => {
    try {
      const response = await axios.post(`${API_URL}/relatorio`, relatorio);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar relatório:", error);
      throw error;
    }
  },

  atualizarRelatorio: async (id: number, relatorio: any) => {
    try {
      const response = await axios.put(`${API_URL}/relatorio/${id}`, relatorio);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar relatório ${id}:`, error);
      throw error;
    }
  },

  deletarRelatorio: async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/relatorio/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar relatório ${id}:`, error);
      throw error;
    }
  }
};
