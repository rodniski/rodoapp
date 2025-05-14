/* --------------------------------------------------------------------------
 * _lib/types/prenota.ts
 * Tipagens completas do **Domínio Pré‑Nota** – estado + endpoint POST
 * --------------------------------------------------------------------------*/

export type DateString = `${number}/${number}/${number}`;

/* ==========================================================================
 * 0 ▸ Store – objetos mantidos em memória enquanto o usuário edita
 * ==========================================================================*/

/** Tipos auxiliares */
export const TpNota = { NORMAL: "N", SERVICO: "S" } as const;
export const TpRodo = {
  REVENDA: "Revenda",
  DESPESA_IMOB: "Despesa/Imobilizado",
  MATERIA_PRIMA: "Materia Prima",
  COLLECTION: "Collection",
  GARANTIA: "Garantia Concebida",
  "": "",
} as const;
export type TipoNota = (typeof TpNota)[keyof typeof TpNota];
export type TipoRodo = (typeof TpRodo)[keyof typeof TpRodo];

/** Cabeçalho principal da Pré-Nota */
export interface PreNotaHeader {
  FILIAL: string;
  OPCAO: 3; // inclusão fixo = 3
  TIPO: TipoNota;
  FORNECEDOR: string;
  LOJA: string;
  DOC: string;
  SERIE: string;
  OLDSERIE: string;
  ESPECIE: string;
  CONDFIN: string;
  CHVNF: string;
  USERAPP: string;
  OBS: string;
  prioridade: "Alta" | "Media" | "Baixa" | "";
  JUSTIFICATIVA: string;
  // Assume que Zod garante que o valor em draft seja TipoRodo
  tiporodo: TipoRodo;
  DTINC: DateString | "";
  CGCPIX: string;
  CHAVEPIX: string;
}

/** Arquivo anexo (metadados) */
export interface Anexo {
  seq: string; // Identificador único do anexo na UI/lote
  arq: string; // Nome do arquivo como será referenciado/salvo no backend
  desc: string; // Descrição do anexo
}

/** Parcela de pagamento */
export interface Parcela {
  Parcela: string;
  Vencimento: string | "";
  Valor: number;
}

/** Rateio por centro de custo / filial */
export interface Rateio {
  seq: string; // Identificador único do rateio na UI
  id: string; // Pode ser o mesmo que seq ou outro ID se necessário
  FIL: string;
  cc: string;
  percent: number;
  valor: number;
  REC: number; // O que significa este REC no rateio? É sempre 0 inicialmente?
}

/** Item da nota fiscal */
export interface PreNotaItem {
  ITEM: string;
  PRODUTO: string;
  QUANTIDADE: number;
  VALUNIT: number;
  PRODFOR: string;
  DESCFOR: string;
  ORIGEMXML: string;
  TOTAL: number;
  PC: string;
  ITEMPC: string;
  B1_UM: string;
  SEGUN: string;
  TPFATO: string;
  CONV: number;
  ORIGEM: string;
  B1_DESC?: string; // Opcional, presente em alguns payloads
}

/** Draft completo usado pela UI (e validado por Zod) */
export interface PreNotaDraft {
  header: PreNotaHeader;
  ARQUIVOS: Anexo[]; // Metadados dos arquivos
  PAGAMENTOS: Parcela[];
  RATEIOS: Rateio[];
  itens: PreNotaItem[];
}

/** Draft inicial (exemplo) */
export const preNotaInitial: PreNotaDraft = {
  // ... (seu preNotaInitial aqui) ...
  header: {
    FILIAL: "",
    OPCAO: 3,
    TIPO: TpNota.NORMAL,
    FORNECEDOR: "",
    LOJA: "",
    DOC: "",
    SERIE: "",
    OLDSERIE: "",
    ESPECIE: "NF",
    CONDFIN: "",
    CHVNF: "",
    USERAPP: "",
    OBS: "",
    prioridade: "",
    JUSTIFICATIVA: "",
    tiporodo: "",
    DTINC: "",
    CGCPIX: "",
    CHAVEPIX: "",
  },
  ARQUIVOS: [],
  PAGAMENTOS: [],
  RATEIOS: [],
  itens: [],
};

/** Patch de cabeçalho vindo do XML */
export type XmlHeaderPatch = Partial<PreNotaHeader>;

/** Item "normalizado" vindo do XML */
export type XmlItem = PreNotaItem;

/** State + actions (Store Principal - usePreNotaStore) */
export interface PreNotaState {
  draft: PreNotaDraft;
  mode: "manual" | "xml";
  setHeader: (patch: Partial<PreNotaHeader>) => void;
  setHeaderPatch: (patch: Partial<PreNotaHeader>) => void;
  setItens: (list: PreNotaItem[]) => void;
  addItem: (it: PreNotaItem) => void;
  updateItem: (idx: number, patch: Partial<PreNotaItem>) => void;
  removeItem: (idx: number) => void;
  // Ações para manipular o array de metadados ARQUIVOS no draft
  addAnexo: (a: Anexo) => void;
  removeAnexo: (seq: string) => void;
  updateAnexoDesc: (seq: string, description: string) => void;
  clearAnexos: () => void;
  setParcelas: (p: Parcela[]) => void;
  addRateio: (r: Rateio) => void;
  updateRateio: (id: string, patch: Partial<Rateio>) => void;
  removeRateio: (id: string) => void;
  setModoXml: () => void;
  setModoManual: () => void;
  reset: () => void;
}

/* ==========================================================================
 * 1 ▸ API – Tipos para a comunicação com o backend Protheus
 * ==========================================================================*/

// --- Payload enviado para POST /PreNota/InclusaoPreNota ---
// *** COMENTÁRIO ATUALIZADO ***
// Contém todos os dados da pré-nota, incluindo METADADOS dos arquivos.
// O conteúdo dos arquivos é enviado depois via postAnexo.
export interface PostPreNotaPayload {
  FILIAL: string;
  OPCAO: 3;
  TIPO: TipoNota;
  FORNECEDOR: string;
  LOJA: string;
  DOC: string;
  SERIE: string;
  OLDSERIE: string;
  ESPECIE: string;
  CONDFIN: string;
  CHVNF: string;
  USERAPP: string;
  OBS: string;
  prioridade: string; // "Alta" | "Media" | "Baixa" | ""
  JUSTIFICATIVA: string;
  // Assume que Zod garante que o valor é TipoRodo (que inclui "")
  tiporodo: TipoRodo;
  DTINC: DateString | "";
  CGCPIX: string;
  CHAVEPIX: string;
  ARQUIVOS: Anexo[]; // <--- CONFIRMADO: Array com metadados dos anexos
  // Tipos inline para arrays (equivalentes a Parcela, Rateio, PreNotaItem)
  PAGAMENTOS: Array<{
    Parcela: string;
    Vencimento: DateString | "";
    Valor: number;
  }>;
  RATEIOS: Array<{
    seq: string;
    id: string;
    FIL: string;
    cc: string;
    percent: number;
    valor: number;
    REC: number;
  }>;
  itens: Array<{
    ITEM: string;
    PRODUTO: string;
    QUANTIDADE: number;
    VALUNIT: number;
    PRODFOR: string;
    DESCFOR: string;
    ORIGEMXML: string;
    TOTAL: number;
    PC: string;
    ITEMPC: string;
    B1_UM: string;
    SEGUN: string;
    TPFATO: string;
    CONV: number;
    ORIGEM: string;
    B1_DESC?: string; // Mantém opcional
  }>;
}

// --- Resposta da API /PreNota/InclusaoPreNota ---

// Resposta de SUCESSO LÓGICO (Sucesso: true)
// *** AJUSTADO PARA INCLUIR REC ***
export interface PostPreNotaSuccessResponse {
  Sucesso: true;
  REC: string; // CONFIRMADO: Identificador principal (string) para anexos.
  Mensagem?: string; // Mensagem opcional de sucesso (contém o número da PN).
  Documento?: string; // Campo extra presente na resposta.
  numero?: string; // Mantido opcional, caso outra API/cenário retorne ou se extraia da Mensagem.
  // id?: string;        // Removido, pois REC parece ser o identificador usado.
  [k: string]: unknown; // Permite outros campos inesperados.
}

// Resposta de ERRO LÓGICO (Sucesso: false, HTTP 200 OK)
export interface PostPreNotaErrorResponse {
  Sucesso: false;
  Mensagem: string; // Mensagem de erro obrigatória
  [k: string]: unknown; // Permite outros campos
}

// Tipo Unificado da Resposta (discriminated union)
export type PostPreNotaResponse =
  | PostPreNotaSuccessResponse
  | PostPreNotaErrorResponse;

/* ==========================================================================
 * 2 ▸ Hook – opções extras passadas ao fetch (se necessário)
 * ==========================================================================*/

export interface PostPreNotaOptions {
  signal?: AbortSignal;
  [k: string]: unknown; // Outras opções do fetch
}
