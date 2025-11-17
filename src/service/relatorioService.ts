import axios from "axios";
import { API_URL } from "./api";

interface RelatorioData {
  aluno_id: number;
  dia: string;
  observacao: string;
  escalas: string;
  repertorio: string;
}

export const relatorioService = {
  relatorioByNome: async (nome: string) => {
    try {
      const response = await axios.get(`${API_URL}/relatorio/buscar/${nome}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar relatórios do aluno ${nome}:`, error);
      throw error;
    }
  },

  getRelatorios: async () => {
    try {
      const response = await axios.get(`${API_URL}/relatorio`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar relatórios:", error);
      throw error;
    }
  },

  getRelatorioById: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/relatorio/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar relatório ${id}:`, error);
      throw error;
    }
  },

  criarRelatorio: async (relatorio: RelatorioData) => {
    try {
      const response = await axios.post(`${API_URL}/relatorio/salvar`, relatorio);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar relatório:", error);
      throw error;
    }
  },

  atualizarRelatorio: async (id: number, relatorio: RelatorioData) => {
    try {
      const response = await axios.patch(`${API_URL}/relatorio/update/${id}`, relatorio);
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