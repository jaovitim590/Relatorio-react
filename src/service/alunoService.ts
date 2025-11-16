import axios from "axios";
import { API_URL } from "./api";

export const alunoService = {
  getAlunos: async () => {
    try {
      const response = await axios.get(`${API_URL}/aluno`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      throw error;
    }
  },

  getAlunoById: async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/aluno/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar aluno ${id}:`, error);
      throw error;
    }
  },

  criarAluno: async (aluno: string) => {
    try {
      const response = await axios.post(`${API_URL}/aluno`, aluno);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar aluno:", error);
      throw error;
    }
  },

  atualizarAluno: async (id: number, aluno: string) => {
    try {
      const response = await axios.put(`${API_URL}/aluno/${id}`, aluno);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar aluno ${id}:`, error);
      throw error;
    }
  },

  deletarAluno: async (id: number) => {
    try {
      const response = await axios.delete(`${API_URL}/aluno/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar aluno ${id}:`, error);
      throw error;
    }
  }
};
