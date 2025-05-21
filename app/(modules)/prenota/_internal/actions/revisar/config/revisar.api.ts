import axios from "axios";
import type {
  RevisaoPreNotaPayload,
  RevisaoPreNotaApiResponse,
} from "./revisar.type";
import { config } from "logic";

const REVISAR_PRENOTA_URL = `${config.API_PRODUCTION_URL}PreNota/RevisaoPreNota`;

/**
 * Solicita revisão de uma Pré-Nota via API.
 */
export async function solicitarRevisaoPreNota(
  payload: RevisaoPreNotaPayload // Usa o tipo de revisar.types.ts
): Promise<RevisaoPreNotaApiResponse> {
  const data = {
    RECSF1: payload.RECSF1,         // Deve ser number conforme revisar.types.ts
    REVISAR: payload.REVISAR,       // string
    USER: payload.USER,           // string
    EMAILS: payload.EMAILS || "",   // string (payload.EMAILS é string ou undefined)
    FINALIZADO: payload.FINALIZADO, // <<< CORREÇÃO: Envia o BOOLEAN diretamente!
  };

  // console.log("API Request Payload (PUT):", data); // Para depuração

  // Mantém o PUT com base na análise da requisição OPTIONS do projeto antigo
  const response = await axios.put<RevisaoPreNotaApiResponse>(
    REVISAR_PRENOTA_URL,
    data, // 'data' agora contém FINALIZADO como boolean (ex: true ou false)
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return response.data;
}