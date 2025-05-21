/* --------------------------------------------------------------------------
 * _lib/api/post-prenota.ts
 * Função para enviar a Pré-Nota ao servidor
 * --------------------------------------------------------------------------*/

import type {
  PostPreNotaPayload, // Use o tipo de payload definido
  PostPreNotaResponse, // Use o tipo de resposta unificado
  PostPreNotaOptions,
} from "@inclusao/types"; // Ajuste o caminho se necessário
import { config } from "logic";

export async function postPreNota(
  payload: PostPreNotaPayload, // Tipagem correta do payload
  options?: PostPreNotaOptions
): Promise<PostPreNotaResponse> {
  // Promete retornar a resposta unificada
  let response: Response;
  const url = `${config.API_PRODUCTION_URL}PreNota/InclusaoPreNota`;

  try {
    response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json", // Importante para garantir que a API retorne JSON
      },
      // JSON.stringify lida com a serialização dos números
      body: JSON.stringify(payload),
      signal: options?.signal,
      ...options, // Permite passar outras opções de fetch
    });
  } catch (networkError: any) {
    // Erro de rede (servidor offline, DNS, CORS não configurado no servidor, etc.)
    console.log(`Erro de rede ao chamar ${url}:`, networkError);
    // Lança um erro genérico que será capturado pelo `onError` do useMutation
    throw new Error(`Falha na conexão com o servidor: ${networkError.message}`);
  }

  let responseData: unknown;
  try {
    // Tenta parsear o JSON independentemente do status HTTP,
    // pois a API pode retornar detalhes do erro no corpo mesmo com status 200 ou outros.
    responseData = await response.json();
  } catch (parsingError: any) {
    console.log(`Erro ao parsear JSON da resposta de ${url}:`, parsingError);
    // Se o parse falhou E a resposta HTTP não foi OK, o problema é duplo.
    if (!response.ok) {
      throw new Error(
        `Erro HTTP ${response.status} (${response.statusText}) e falha ao processar corpo da resposta.`
      );
    }
    // Se o parse falhou mas a resposta foi OK (ex: 200 com corpo vazio ou não-JSON),
    // isso indica um problema na API que retornou 200 indevidamente.
    throw new Error(
      "Resposta inesperada do servidor (status OK, mas corpo inválido ou não-JSON)."
    );
  }

  // ---- VALIDAÇÃO DA RESPOSTA ----

  // 1. Validação do Status HTTP (redundante se a API *sempre* retorna 200, mas boa prática)
  // Se a API PODE retornar outros status para erros (4xx, 5xx), este bloco é útil.
  // Se ela SEMPRE retorna 200, este 'if' pode nunca ser verdadeiramente útil para erros *lógicos*.
  if (!response.ok) {
    // Tenta extrair uma mensagem do corpo JSON, se possível.
    const errorMessage =
      typeof responseData === "object" &&
      responseData !== null &&
      "Mensagem" in responseData
        ? String(responseData.Mensagem) // Usa a Mensagem da API se existir
        : `Erro HTTP ${response.status}: ${
            response.statusText || "Falha na requisição"
          }`; // Fallback
    throw new Error(errorMessage);
  }

  // 2. Validação Lógica Baseada no Corpo da Resposta (Tipo `PostPreNotaResponse`)
  // Neste ponto, assumimos status HTTP 2xx (geralmente 200 OK).
  // Precisamos validar se o `responseData` corresponde à nossa `PostPreNotaResponse`.
  if (
    typeof responseData === "object" &&
    responseData !== null &&
    "Sucesso" in responseData // Verifica a presença do discriminador
  ) {
    // O objeto tem a propriedade 'Sucesso', então podemos tratá-lo como PostPreNotaResponse.
    const serverResponse = responseData as PostPreNotaResponse; // Cast seguro aqui

    // Verifica explicitamente o caso de ERRO LÓGICO (`Sucesso: false`)
    if (serverResponse.Sucesso === false) {
      // A API indicou um erro lógico, mesmo com HTTP 200.
      // NÃO lançamos um erro aqui diretamente. Retornamos a resposta de erro.
      // O hook que chamou esta função decidirá o que fazer (provavelmente lançar erro).
      console.warn(
        "API retornou erro lógico (Sucesso: false):",
        serverResponse.Mensagem
      );
      return serverResponse; // Retorna o objeto de erro { Sucesso: false, Mensagem: "..." }
    }

    // Verifica explicitamente o caso de SUCESSO LÓGICO (`Sucesso: true`)
    if (serverResponse.Sucesso === true) {
      // Verifica se os campos esperados para sucesso (`id`, `numero`) estão presentes.
      if (
        typeof serverResponse.id === "string" &&
        typeof serverResponse.numero === "string"
      ) {
        // Tudo certo, retorna a resposta de sucesso.
        return serverResponse; // Retorna o objeto de sucesso { Sucesso: true, id: "...", numero: "..." }
      } else {
        // Sucesso: true, mas faltam campos essenciais. Erro de contrato da API.
        console.log(
          "Resposta de sucesso da API com formato inesperado (faltando id ou numero):",
          serverResponse
        );
        throw new Error(
          "Resposta de sucesso do servidor com formato inválido."
        );
      }
    }
  }

  // Se chegou aqui, a resposta foi 2xx, mas o corpo JSON não tem a propriedade 'Sucesso'
  // ou não corresponde à estrutura esperada.
  console.log(
    `Resposta da API (${url}) com estrutura inesperada:`,
    responseData
  );
  throw new Error("Resposta do servidor com formato inesperado.");
}
