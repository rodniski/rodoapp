/* --------------------------------------------------------------------------
 *  _lib/types/prenota.ts
 *  Tipagens completas do **Domínio Pré‑Nota** – estado + endpoint POST
 * --------------------------------------------------------------------------
 * 0 ▸ Store           – estruturas mantidas no Zustand
 * 1 ▸ API             – função `postPreNota.ts`
 * 2 ▸ Hook            – `usePostPreNota.ts`
 * --------------------------------------------------------------------------*/

export type DateString = `${number}/${number}/${number}`;

/* ==========================================================================
 * 0 ▸ Store – objetos mantidos em memória enquanto o usuário edita
 * ==========================================================================*/

/** Tipos auxiliares */
export const TpNota = { NORMAL: "N", SERVICO: "S" } as const;

export const TpRodo = {
  REVENDA: "Revenda",
  DESPESA_IMOB: "Despesa/Imobilizado",
  MATERIA_PRIMA: "Matéria Prima",
  COLLECTION: "Collection",
  GARANTIA: "Garantia Concebida",
  "": "",
} as const;

export type TipoNota = (typeof TpNota)[keyof typeof TpNota];

/* Draft inicial – 100 % tipado */
export const preNotaInitial: PreNotaDraft = {
  header: {
    FILIAL: "",
    OPCAO: 3,
    TIPO: TpNota.NORMAL,
    FORNECEDOR: "",
    LOJA: "",
    DOC: "",
    SERIE: "",
    ESPECIE: "NF",
    CONDFIN: "",
    USERAPP: "",
    tiporodo: "",
    DTINC: "",
  },
  anexos: [],
  parcelas: [],
  rateios: [],
  itens: [],
};

/** Cabeçalho principal da Pré‑Nota */
export interface PreNotaHeader {
  FILIAL: string;
  OPCAO: 3; // inclusão fixo = 3
  TIPO: TipoNota;
  FORNECEDOR: string;
  LOJA: string;
  DOC: string;
  SERIE: string;
  OLDSERIE?: string;
  ESPECIE: string;
  CONDFIN: string;
  CHVNF?: string;
  USERAPP: string;
  OBS?: string;
  prioridade?: "Alta" | "Média" | "Baixa";
  JUSTIFICATIVA?: string;
  tiporodo: string;
  DTINC: string;
  /* PIX */
  CGCPIX?: string;
  CHAVEPIX?: string;
}

/** Arquivo anexo */
export interface Anexo {
  seq: string;
  arq: string;
  desc?: string;
}

export interface AnexoUpload {
  seq: string;
  file: File;
  description: string;
}

/** Parcela de pagamento */
export interface Parcela {
  Parcela: string;
  Vencimento: DateString;
  Valor: number;
}

/** Rateio por centro de custo / filial */
export interface Rateio {
  Z10_ITEM: string;
  Z10_FILRAT: string;    
  Z10_CC: string;
  Z10_VALOR: number;
  Z10_PERC: number;
  REC: number;
}

/** Item da nota fiscal */
export interface PreNotaItem {
  ITEM: string;
  PRODUTO: string;
  QUANTIDADE: number;
  VALUNIT: number;
  PRODFOR?: string;
  DESCFOR?: string;
  ORIGEMXML?: string;
  TOTAL: number;
  PC?: string;
  ITEMPC?: string;
  B1_UM: string;
  SEGUN?: string;
  TPFATO?: string;
  CONV?: number;
  ORIGEM: string | number;
}

/** Patch de cabeçalho que vem do XML
 *  → é só um `Partial` do cabeçalho original */
export type XmlHeaderPatch = Partial<PreNotaHeader>;

/** Item “normalizado” vindo do XML
 *  → usa exatamente a mesma estrutura do Item do draft */
export type XmlItem = PreNotaItem;

/** Draft completo usado pela UI */
export interface PreNotaDraft {
  header: PreNotaHeader;
  anexos: Anexo[];
  parcelas: Parcela[];
  rateios: Rateio[];
  itens: PreNotaItem[];
}

/* State + actions --------------------------------------------------------*/
export interface PreNotaState {
  draft: PreNotaDraft;
  mode: "manual" | "xml";

  /* Header ---------------------------------------------------------------*/
  setHeader: (patch: Partial<PreNotaHeader>) => void;
  setHeaderPatch: (patch: Partial<PreNotaHeader>) => void;

  /* Itens ----------------------------------------------------------------*/
  setItens: (list: PreNotaItem[]) => void;
  addItem: (it: PreNotaItem) => void;
  updateItem: (idx: number, patch: Partial<PreNotaItem>) => void;
  removeItem: (idx: number) => void;

  /* Anexos ---------------------------------------------------------------*/
  addAnexo: (a: Anexo) => void;
  removeAnexo: (seq: string) => void;
  updateAnexoDesc: (seq: string, description: string) => void; 
  clearAnexos: () => void;  

  /* Parcelas -------------------------------------------------------------*/
  setParcelas: (p: Parcela[]) => void;

  /* Rateios --------------------------------------------------------------*/
  addRateio: (r: Rateio) => void;
  updateRateio: (id: string, patch: Partial<Rateio>) => void;
  removeRateio: (id: string) => void;

  /* Outros ---------------------------------------------------------------*/
  setModoXml: () => void;
  setModoManual: () => void;
  reset: () => void;
}

/* ==========================================================================
 * 1 ▸ API – retorno do backend Protheus
 * ==========================================================================*/

export interface PostPreNotaResponse {
  id: string; // GUID ou número interno
  numero: string; // número “visível” da pré‑nota
  mensagem?: string; // mensagem opcional
  [k: string]: unknown; // extras eventuais
}

/* ==========================================================================
 * 2 ▸ Hook – opções extras passadas ao fetch
 * ==========================================================================*/

export interface PostPreNotaOptions {
  signal?: AbortSignal; // permite abortar a requisição
  [k: string]: unknown; // fetch‑init extra (mode, cache…)
}
