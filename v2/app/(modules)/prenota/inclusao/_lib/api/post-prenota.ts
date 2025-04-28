import axios from "axios";
import { config } from "config";
import { usePreNotaStore } from "@inclusao/stores";
import type {
  PreNotaDraft,
  PostPreNotaResponse,
} from "@inclusao/types";

/* ----------------------------------------------------------------------------
 *  END-POINT  ->  .../rest/prenota/InclusaoPreNota
 * -------------------------------------------------------------------------- */
const PRENOTA_API_URL =
  `${config.API_DEVELOPMENT_URL}prenota/InclusaoPreNota`;      // ← troque p/ PROD se quiser

/* -------- util: obtém o draft atual do Zustand e devolve um “plain object” -- */
function getDraftFromStore(): PreNotaDraft {
  //  ⚠️  nunca espalhe o objeto do Zustand direto no Axios
  //      (ele tem Proxies internos); copie antes.
  const draft = structuredClone(usePreNotaStore.getState().draft);

  // Normalizações rápidas (caso falte algo):
  if (!draft.header.DTINC) {
    draft.header.DTINC = new Intl.DateTimeFormat("pt-BR")
      .format(new Date()) as any;
  }
  return draft;
}

/* ============================================================================
 *      postPreNota
 * ==========================================================================*/
export async function postPreNota(
  body?: PreNotaDraft                     // opcional – pode mandar explícito
): Promise<PostPreNotaResponse> {
  const payload = body ?? getDraftFromStore();

  /* ------- validação mínima antes de enviar ---------------------------- */
  const required = [
    "FILIAL",
    "FORNECEDOR",
    "LOJA",
    "DOC",
    "SERIE",
    "CONDFIN",
    "DTINC",
  ] as const;

  const missing = required.filter((k) => !(payload.header as any)[k]);
  if (missing.length) {
    throw new Error(
      `Campos obrigatórios ausentes no header da Pré-Nota: ${missing.join(", ")}`
    );
  }

  /* --------------------------- POST ------------------------------------ */
  try {
    const { data } = await axios.post<PostPreNotaResponse>(
      PRENOTA_API_URL,
      payload,
      {
        headers: { "Content-Type": "application/json" },
        // timeout: 10000,
      }
    );
    return data;
  } catch (err: unknown) {
    /* -------- tratamento de erro padrão (igual CondPag) ---------------- */
    if (axios.isAxiosError(err) && err.response) {
      console.error(
        `[API PreNota] Erro ${err.response.status}:`,
        err.response.data
      );
      throw new Error(
        (err.response.data?.mensagem as string) ||
          `API retornou ${err.response.status}`
      );
    }
    throw err instanceof Error ? err : new Error("Falha inesperada no POST");
  }
}
