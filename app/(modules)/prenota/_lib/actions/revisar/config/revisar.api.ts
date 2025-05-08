import axios from "axios";
import type {
  RevisaoPreNotaPayload,
  RevisaoPreNotaApiResponse,
} from "@prenota/actions";
import { config } from "config";

const REVISAR_PRENOTA_URL = `${config.API_PRODUCTION_URL}PreNota/RevisaoPreNota`;

/**
 * Solicita revisão de uma Pré-Nota via API.
 */
export async function solicitarRevisaoPreNota(
  payload: RevisaoPreNotaPayload
): Promise<RevisaoPreNotaApiResponse> {
  const data = {
    RECSF1: payload.RECSF1,
    REVISAR: payload.REVISAR,
    USER: payload.USER,
    EMAILS: Array.isArray(payload.EMAILS)
      ? payload.EMAILS.join(";")
      : payload.EMAILS || "",
    FINALIZADO: "True",
  };

  const response = await axios.post<RevisaoPreNotaApiResponse>(
    REVISAR_PRENOTA_URL,
    data,
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  return response.data;
}
