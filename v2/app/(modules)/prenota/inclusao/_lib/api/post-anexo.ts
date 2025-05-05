// src/api/postAnexo.ts
import axios, { AxiosError } from "axios";

// Endpoint para upload de anexos (Confirmado pelo seu exemplo Node.js)
const UPLOAD_ANEXO_URL = `http://172.16.99.187:3001/upload`;

// --- Tipagem da Resposta da API de Upload ---
// Mantendo a suposição de que a resposta usa Sucesso/Mensagem.
// Adapte se a resposta real for diferente (ex: só retorna status 200/erro).
interface UploadAnexoSuccessResponse {
  Sucesso: true;
  Mensagem?: string;
  [k: string]: unknown;
}

interface UploadAnexoErrorResponse {
  Sucesso: false;
  Mensagem: string;
  [k: string]: unknown;
}

type UploadAnexoResponse =
  | UploadAnexoSuccessResponse
  | UploadAnexoErrorResponse;

// --- Função postAnexo ---

/**
 * Faz o upload de um único anexo vinculado a uma pré-nota (rodando no BROWSER).
 * Envia os campos 'file', 'seq', 'doc' via FormData.
 *
 * @param doc Identificador da Pré-Nota (ex: o 'id' retornado por postPreNota).
 * @param seq Identificador único deste anexo dentro da Pré-Nota (gerado na UI).
 * @param file O objeto File ou Blob (vindo do input ou store no browser).
 * @throws {Error} Lança um erro se o upload falhar (rede, status não-2xx, ou Sucesso: false).
 * @returns {Promise<UploadAnexoSuccessResponse>} Retorna a resposta de sucesso da API em caso de êxito.
 */
export async function postAnexo(
  doc: string,
  seq: string,
  file: File | Blob // Recebe File ou Blob do browser
): Promise<UploadAnexoSuccessResponse> {
  // 1. Usa o FormData nativo do BROWSER
  const formData = new FormData();

  // 2. Adiciona os campos EXATOS que a API espera (confirmado pelo seu exemplo)
  //    - O browser adiciona o nome do arquivo automaticamente se 'file' for um objeto File.
  formData.append("file", file, file instanceof File ? file.name : "blob");
  formData.append("seq", seq);
  formData.append("doc", doc);
  // formData.append("desc", description); // REMOVIDO - API não espera descrição

  console.debug(
    `[postAnexo] Enviando anexo: seq=${seq}, doc=${doc}, file=${
      file instanceof File ? file.name : "blob"
    }`
  );

  try {
    // 3. Deixa o Axios (no browser) definir o Content-Type: multipart/form-data com o boundary correto.
    //    NÃO defina headers manualmente para FormData no browser.
    //    NÃO use maxBodyLength (opção do Node.js).
    const response = await axios.post<UploadAnexoResponse>(
      UPLOAD_ANEXO_URL,
      formData
      // Sem 'headers' explícitos aqui
      // Sem 'maxBodyLength' aqui
    );

    // 4. Checa a resposta lógica (Sucesso/Mensagem) - MANTIDO
    const responseData = response.data;

    if (responseData?.Sucesso === false) {
      const errorMessage =
        responseData.Mensagem ||
        "Falha no upload do anexo (sem mensagem específica)";
      console.error(
        `[postAnexo] Erro lógico da API de upload (seq: ${seq}): ${errorMessage}`
      );
      throw new Error(errorMessage);
    }

    if (responseData?.Sucesso === true) {
      console.log(
        `[postAnexo] Anexo enviado com sucesso (seq: ${seq}):`,
        responseData
      );
      return responseData;
    }

    console.error(
      `[postAnexo] Resposta inesperada da API de upload (seq: ${seq}):`,
      responseData
    );
    throw new Error("Resposta inesperada do servidor de upload.");
  } catch (error) {
    // Tratamento de erro Axios (rede, status, etc.) - MANTIDO
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<UploadAnexoResponse>;
      console.error(
        `[postAnexo] Erro Axios ao enviar anexo (seq: ${seq}):`,
        axiosError.message
      );
      console.error(
        `[postAnexo] Status: ${axiosError.response?.status}, Data:`,
        axiosError.response?.data
      );
      const apiErrorMessage = axiosError.response?.data?.Mensagem;
      const finalMessage =
        apiErrorMessage ||
        axiosError.message ||
        "Erro desconhecido no upload do anexo";
      throw new Error(finalMessage);
    } else {
      console.error(
        `[postAnexo] Erro não-Axios ao enviar anexo (seq: ${seq}):`,
        error
      );
      throw error; // Repassa o erro (provavelmente de Sucesso: false)
    }
  }
}
