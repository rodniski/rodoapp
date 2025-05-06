

import axios from "axios";
import type { FilialGeral } from "@/app/login/_lib/types";
import { config } from "config";

const FILIAIS_API_URL = `${config.API_PRODUCTION_URL}reidoapsdu/consultar/filiais/`;

export async function fetchFiliais(): Promise<FilialGeral[]> {
  try {
    const response = await axios.get<FilialGeral[]>(FILIAIS_API_URL, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar filiais gerais:", error);
    throw error;
  }
}
