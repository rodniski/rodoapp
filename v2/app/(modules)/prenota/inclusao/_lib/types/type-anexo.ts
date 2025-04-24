/* --------------------------------------------------------------------------
 *  _lib/types/anexo.ts
 *  Tipagens exclusivamente ligadas ao **POST /Prenota/Anexo**
 * --------------------------------------------------------------------------
 * 0 ▸ Store (re‑export) – estrutura de anexo exportada pelo prenota      *
 * 1 ▸ API  – payload e resposta da rota de upload                        *
 * 2 ▸ Hook – opções extras para o fetch (mutation)                       *
 * --------------------------------------------------------------------------*/

/* ==========================================================================
 * 0 ▸ Store – estrutura de anexo usada no Upload
 * ==========================================================================*/
export interface UploadItem {
  seq: string;
  fileName: string;
  description: string; 
}

export interface AnexoUploadState {
  queue: UploadItem[];
  addUpload:     (seq: string, fileName: string) => void;
  updateProgress:(seq: string, progress: number) => void;
  clearUpload:   (seq: string) => void;
}

/* ==========================================================================
 * 1 ▸ API – payload esperado e resposta devolvida
 * ==========================================================================*/

/** Dados necessários para enviar um arquivo como anexo */
export interface PostAnexoPayload {
  seq: string;             // sequencial "001", "002"…
  fileName: string;        // nome original (+ extensão)
  file: File | Blob;       // binário
  descricao?: string;      // texto livre opcional
  idPrenota?: string;      // caso queira anexar após salvar a pré‑nota
}

/** Resposta padrão ao concluir o upload */
export interface PostAnexoResponse {
  savedFileName: string;   // nome salvo no servidor
  seq: string;             // sequencial confirmado
  url?: string;            // se a API expuser link de download
  [k: string]: unknown;    // campos extras eventuais
}

/* ==========================================================================
 * 2 ▸ Hook – opções adicionais passadas ao mutation
 * ==========================================================================*/
export interface PostAnexoOptions {
  signal?: AbortSignal;    // para cancelar o upload
  [k: string]: unknown;    // init extra do fetch
}

// Interface para o estado e ações deste store auxiliar (combinado)
export interface FileUploadAuxState {
  /** Array contendo os arquivos prontos para upload ou já anexados */
  uploadedFiles: UploadItem[];

  // Ações para gerenciar os ARQUIVOS (uploadedFiles)
  addFile: (file: File, initialDescription?: string) => string; // Retorna o SEQ gerado
  removeFile: (seq: string) => void;
  updateFileDescription: (seq: string, description: string) => void;
  clearFiles: () => void;
  getFileBySeq: (seq: string) => File | undefined;
  getDescriptionBySeq: (seq: string) => string | undefined; // Helper adicional

  // Ações para gerenciar o PROGRESSO do UPLOAD (uploadQueue)
  addUpload: (seq: string, fileName: string) => void; // Adiciona à fila de progresso
  updateProgress: (seq: string, progress: number) => void; // Atualiza progresso
  clearUpload: (seq: string) => void; // Remove da fila de progresso
}
