/* ──────────────────────────  attachments.types.ts  ──────────────────────────
 * Todas as tipagens relacionadas a **anexos** de Pré-nota:
 *   – modelo de dado (Attachment)
 *   – props de componente (AttachmentItemProps)
 *   – contratos do hook useAnexoDownload
 * ---------------------------------------------------------------------------*/

/* ╔══════════════════════════════════════════════╗
   ║ 1 ▸ MODELO DE DADO (registro no Protheus)    ║
   ╚══════════════════════════════════════════════╝ */

/**
 * Um anexo gravado na Z07010 (ou tabela equivalente).
 */
export interface Attachment {
  Z07_FILIAL: string;
  Z07_CHAVE: string;
  Z07_DESC: string;
  Z07_PATH: string;
}

/* ╔══════════════════════════════════════╗
   ║ 2 ▸ PROPS DO ITEM LISTADO NA UI      ║
   ╚══════════════════════════════════════╝ */

/**
 * Item individual renderizado no painel “Anexos”.
 */
export interface AttachmentItemProps {
  /** Dados crus do anexo (path + descrição para exibir). */
  attachment: Pick<Attachment, "Z07_PATH" | "Z07_DESC">;

  /** Callback chamado ao clicar para baixar o arquivo */
  onDownload: (path: string) => void;

  /** Posição do item na lista (para key / ordenação) */
  index: number;
}

/* ╔═════════════════════════════════════════════╗
   ║ 3 ▸ CONTRATO DO HOOK  useAnexoDownload      ║
   ╚═════════════════════════════════════════════╝ */

/** Parâmetros de entrada do hook. */
export interface UseAnexoDownloadProps {
  /** Caminho (base) do anexo que o usuário acionou. */
  AnexoPath: string;
}

/** Retorno padronizado do hook. */
export interface UseAnexoDownloadReturn {
  /** Todos os anexos recuperados para a pré-nota. */
  attachments: Attachment[];

  /** Flag de carregamento para exibir skeleton/spinner. */
  isLoading: boolean;

  /** Função que dispara o download de um arquivo específico. */
  handleDownload: (path: string) => void;
}
