import { config } from "config";
import axios from "axios";
import type { CargaInicio } from "@/app/login/_lib/types";

const CARGA_INICIO_API_URL = `${config.API_PRODUCTION_URL}reidoapsdu/consultar/cargaInicio`;
export async function fetchCargaInicio(username: string): Promise<CargaInicio> {
  try {
    const response = await axios.get<CargaInicio>(CARGA_INICIO_API_URL, {
      headers: {
        usr: username,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar carga inicial:", error);
    throw error;
  }
}
