
import axios from "axios";
import type { GrupoFilial } from "@login/types";
import { config } from "config";

const GRUPO_FILIAL_API_URL = `${config.API_BORRACHARIA_URL}MovPortaria/GrupoFilial`;

export async function getUserGrupoFilial(
    username: string,
    accessToken: string
  ): Promise<GrupoFilial[]> {
    try {
      const response = await axios.get<GrupoFilial[]>(
        `${GRUPO_FILIAL_API_URL}?Usuario=${encodeURIComponent(username)}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar grupos e filiais:', error);
      throw error;
    }
  }
  
  