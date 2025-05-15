// app/(modules)/prenota/_components/tabela/logic/tabela.api.ts

import { logger } from "utils"; // Presume que o logger está em src/utils/logger.ts ou similar
import type {
  FetchPrenotasApiParams,
  FetchPrenotasResponse,
} from "./tabela.types";
import { PRENOTAS_API_ENDPOINT } from "./tabela.constants";

/**
 * @function fetchPrenotas
 * @description Busca pré-notas na API com base nos parâmetros fornecidos.
 * Envia os parâmetros como corpo de uma requisição POST.
 *
 * @param params Parâmetros para paginação, filtros, ordenação, etc.
 * @returns Uma Promise com a resposta da API contendo os itens e informações de paginação.
 * @throws Lança um erro com mensagem descritiva se a resposta da API não for bem-sucedida,
 * após registrar o erro detalhado.
 */
export const fetchPrenotas = async (
  params: FetchPrenotasApiParams
): Promise<FetchPrenotasResponse> => {
  //! Utilizar valores padrão diretamente na desestruturação garante que o payload tenha a forma esperada.
  const {
    page = 1,
    pageSize = 10,
    filials = [], // Assumindo default como array vazio se aplicável
    searchTerm = "",
    sorting = [],
    filters = {},
  } = params;

  const body = {
    pagination: { page, pageSize },
    filters,
    sorting,
    filials,
    searchTerm,
  };

  //* Realiza a chamada fetch para o endpoint configurado.
  let response: Response;
  try {
    response = await fetch(PRENOTAS_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (networkError: any) {
    //? Captura erros de rede (e.g., DNS, offline) que ocorrem antes mesmo de uma resposta HTTP.
    logger.error(networkError, {
      component: "tabela.api.ts",
      operation: "fetchPrenotas (Network Error)",
      endpoint: PRENOTAS_API_ENDPOINT,
      requestBody: body, // Cuidado ao logar dados sensíveis do body em produção.
    });
    throw new Error(
      `Erro de rede ao tentar buscar pré-notas: ${networkError.message}`
    );
  }

  if (!response.ok) {
    let errorResponseMessage = `HTTP error ${response.status}`; // Mensagem de fallback.
    let parsedErrorContent: any = null; // Conteúdo do erro parseado, se houver.
    let rawErrorText = ""; // Texto bruto da resposta de erro.

    try {
      rawErrorText = await response.text(); // Tenta ler o corpo da resposta como texto.
      if (rawErrorText) {
        try {
          parsedErrorContent = JSON.parse(rawErrorText); // Tenta parsear o texto como JSON.
          if (parsedErrorContent && parsedErrorContent.message) {
            errorResponseMessage = parsedErrorContent.message; // Usa a mensagem do JSON se disponível.
          } else if (typeof parsedErrorContent === "string") {
            errorResponseMessage = parsedErrorContent; // Se o JSON parseado for uma string.
          } else {
            errorResponseMessage = rawErrorText; // Se o JSON não tiver 'message', usa o texto bruto.
          }
        } catch (jsonParseError) {
          //? O corpo não era JSON válido, então usamos o texto bruto como mensagem.
          errorResponseMessage = rawErrorText;
        }
      }
    } catch (readError: any) {
      //? Falha ao ler o corpo da resposta de erro. Mantém o fallback.
      logger.warn(
        `Falha ao ler o corpo da resposta de erro da API (status: ${response.status}).`,
        {
          component: "tabela.api.ts",
          operation: "fetchPrenotas (Read Error Body)",
          originalError: readError.message,
        }
      );
    }

    //! Loga o erro de forma estruturada usando o logger configurado.
    // Criamos um novo objeto Error para garantir que o logger capture um stack trace útil.
    const errorToLog = new Error(errorResponseMessage);
    logger.error(errorToLog, {
      component: "tabela.api.ts",
      operation: "fetchPrenotas",
      endpoint: PRENOTAS_API_ENDPOINT,
      requestBody: body, // Considere mascarar/omitir dados sensíveis do body em produção.
      responseStatus: response.status,
      // Inclui o conteúdo parseado e bruto para depuração, se disponível.
      ...(parsedErrorContent && { parsedErrorContent }),
      ...(rawErrorText &&
        rawErrorText !== errorResponseMessage && { rawErrorText }),
    });

    // Lança um erro para ser tratado pela camada que chamou esta função (ex: TanStack Query).
    throw new Error(`Falha ao carregar pré-notas: ${errorResponseMessage}`);
  }

  //* Retorna a resposta da API parseada como JSON, com o tipo esperado.
  try {
    return (await response.json()) as Promise<FetchPrenotasResponse>;
  } catch (jsonParseError: any) {
    //? A resposta foi 'ok' (2xx), mas o JSON é inválido. Isso indica um problema no backend.
    logger.error(jsonParseError, {
      component: "tabela.api.ts",
      operation: "fetchPrenotas (JSON Parse Error on Success)",
      endpoint: PRENOTAS_API_ENDPOINT,
      responseStatus: response.status,
      message: "API retornou status OK, mas o JSON da resposta é inválido.",
    });
    throw new Error(
      "Resposta da API recebida com sucesso, mas o formato dos dados é inválido."
    );
  }
};
