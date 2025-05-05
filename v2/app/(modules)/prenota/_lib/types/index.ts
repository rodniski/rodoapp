export interface PrenotaRow {
  REC: number; // SF1.R_E_C_N_O_
  F4_TRANFIL: string; // TRIM(ISNULL(SF4.F4_TRANFIL, ''))
  F1_FILIAL: string; // TRIM(SF1.F1_FILIAL)
  F1_DOC: string; // TRIM(SF1.F1_DOC)
  F1_SERIE: string; // TRIM(SF1.F1_SERIE)
  F1_STATUS: string; // TRIM(SF1.F1_STATUS)
  A2_COD: string; // TRIM(SA2.A2_COD)
  A2_LOJA: string; // TRIM(SA2.A2_LOJA)
  A2_NOME: string; // TRIM(SA2.A2_NOME)
  F1_EMISSAO: string; // SF1.F1_EMISSAO
  F1_DTDIGIT: string; // SF1.F1_DTDIGIT
  F1_VALBRUT: number; // SUM(SD1.D1_TOTAL)
  F1_XTIPO: string; // TRIM(SF1.F1_XTIPO)
  F1_XPRIOR: string; // TRIM(SF1.F1_XPRIOR)
  F1_XORI: string; // TRIM(SF1.F1_XORI)
  F1_XUSRRA: string; // TRIM(SF1.F1_XUSRRA)
  F1_XOBS: string; // TRIM(SF1.F1_XOBS)
  F1_ZOBSREV: string; // TRIM(SF1.F1_ZOBSREV)
  F1_XREV: string; // TRIM(SF1.F1_XREV)
  USUARIO: string; // SUBSTRING do F1_USERLGI
  VENCIMENTO: string; // ISNULL(Z10.Z10_VENCTO, '')
  Z07_DESC: string; // TRIM(ISNULL(Z07.Z07_DESC, ''))
  Z07_CHAVE: string; // TRIM(ISNULL(Z07.Z07_CHAVE, ''))
  Status: string; // Status
}
export type TipoFiltro =
  | "texto"
  | "numero"
  | "numero-range"
  | "data-range"
  | "select"
  | "select-multiple"
  | "filial-select";


export interface CampoFiltro {
  label: string;
  campo: keyof PrenotaRow;
  tipo: TipoFiltro;
  opcoes?: { label: string; value: string }[] | (() => Promise<{ label: string; value: string }[]>);
  observacao?: string;
}
