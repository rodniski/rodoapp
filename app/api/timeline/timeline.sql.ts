import { Prisma } from "@prisma/client";

/**
 * Retorna toda a linha do tempo de uma pré-nota (SF1) já
 * com os nomes de usuário resolvidos para **pedido** e **lançamento**.
 */
export function getFullTimelineQuery(recsf1: number): Prisma.Sql {
  return Prisma.sql`
    SELECT DISTINCT
        -- ► Chaves básicas
        TRIM(SF1.F1_FILIAL)                      AS "FILIAL",
        SF1.R_E_C_N_O_                           AS "REC_F1",

        /* ───────────────────────── PEDIDO (SC7) ───────────────────────── */
        TRIM(SC7.C7_NUM)                         AS "PEDIDO",
        SC7.C7_EMISSAO                           AS "EMISSAO_PEDIDO",
        TRIM(SC7.C7_OBS)                         AS "OBS_PEDIDO",
        TRIM(SYS_USR1.USR_NOME)                  AS "USUARIO_PEDIDO",

        /* ─────────────────────── NOTA FISCAL (SF1) ────────────────────── */
        SF1.F1_EMISSAO                           AS "EMISSAO_NF",
        TRIM(SF1.F1_DOC)                         AS "NOTA",
        TRIM(SF1.F1_SERIE)                       AS "SERIE",
        SF1.F1_XOBS                              AS "OBS_COMPLEMENTAR",
        SF1.F1_DTLANC                            AS "DATA_CLASSIFICACAO",
        SF1.F1_STATUS                            AS "STATUS_NF",

        /* Quem lançou a pré-nota */
        TRIM(SYS_USR_LANC.USR_NOME)              AS "USUARIO_LANCAMENTO",

        /* Data real de lançamento (F1_RECBMTO ou F1_DTDIGIT) */
        CASE 
          WHEN SF1.F1_STATUS <> ''  THEN SF1.F1_DTDIGIT
          ELSE SF1.F1_RECBMTO
        END                                       AS "DATA_LANCAMENTO_REAL",

        /* ─────────────────────── FORNECEDOR (SA2) ─────────────────────── */
        TRIM(SA2.A2_COD)                         AS "COD_FORNECEDOR",
        TRIM(SA2.A2_NOME)                        AS "FORNECEDOR",
        TRIM(SA2.A2_LOJA)                        AS "LOJA",

        /* ────────────────────────── TÍTULOS (SE2) ─────────────────────── */
        TRIM(SE2.E2_PARCELA)                     AS "NUMERO_PARCELA",
        SE2.E2_VENCTO                            AS "VENCIMENTO",
        SE2.E2_BAIXA                             AS "DATA_BAIXA",
        SE2.E2_VALOR                             AS "VALOR_PARCELA",
        TRIM(SE2.E2_HIST)                        AS "HISTORICO_PARCELA",

        /* ────────────────────────── HISTÓRICO (Z05) ───────────────────── */
        TRIM(Z05.Z05_CAMPO)                      AS "CAMPO",
        TRIM(Z05.Z05_VALATU)                     AS "OBSERVACAO_HISTORICO",
        TRIM(SYS_USR3.USR_NOME)                  AS "USUARIO_HISTORICO",
        Z05.Z05_DATA                             AS "DATA_HISTORICO",
        Z05.Z05_HORA                             AS "HORA_HISTORICO",

        /* Campo auxiliar de ordenação cronológica absoluta          */
        COALESCE(
          SF1.F1_EMISSAO, 
          Z05.Z05_DATA, 
          SE2.E2_VENCTO, 
          SE2.E2_BAIXA, 
          SF1.F1_RECBMTO,
          SF1.F1_DTDIGIT
        )                                         AS "DATA_ORDENACAO"

    FROM   SF1010   SF1  WITH (NOLOCK)

    /* Itens da NF (para pegar o pedido) */
    LEFT  JOIN SD1010   SD1         WITH (NOLOCK)
           ON  SD1.D1_FILIAL  = SF1.F1_FILIAL
          AND SD1.D1_DOC     = SF1.F1_DOC
          AND SD1.D1_SERIE   = SF1.F1_SERIE
          AND SD1.D1_FORNECE = SF1.F1_FORNECE
          AND SD1.D1_LOJA    = SF1.F1_LOJA
          AND SD1.D_E_L_E_T_ = ''

    /* Pedido de compra */
    LEFT  JOIN SC7010   SC7         WITH (NOLOCK)
           ON  SC7.C7_FILIAL  = SD1.D1_FILIAL
          AND SC7.C7_NUM     = SD1.D1_PEDIDO
          AND SC7.C7_ITEM    = SD1.D1_ITEMPC
          AND SC7.C7_PRODUTO = SD1.D1_COD
          AND SC7.D_E_L_E_T_ = ''

    /* Usuário do pedido */
    LEFT  JOIN SYS_USR  SYS_USR1    WITH (NOLOCK)
           ON  SC7.C7_USER      = SYS_USR1.USR_ID
          AND SYS_USR1.D_E_L_E_T_ = ''

    /* Usuário que lançou a pré-nota (F1_XUSRRA) */
    LEFT  JOIN SYS_USR  SYS_USR_LANC WITH (NOLOCK)
           ON  UPPER(TRIM(SF1.F1_XUSRRA)) = UPPER(TRIM(SYS_USR_LANC.USR_CODIGO))
          AND SYS_USR_LANC.D_E_L_E_T_     = ''

    /* Fornecedor */
    LEFT  JOIN SA2010   SA2         WITH (NOLOCK)
           ON  SA2.A2_COD  = SF1.F1_FORNECE
          AND SA2.A2_LOJA = SF1.F1_LOJA
          AND SA2.D_E_L_E_T_ = ''

    /* Histórico RodoApp (Z05) */
    LEFT  JOIN Z05010   Z05         WITH (NOLOCK)
           ON  Z05.Z05_CHAVE  = SF1.R_E_C_N_O_
          AND Z05.Z05_FILIAL = SF1.F1_FILIAL
          AND Z05.Z05_ROTINA = 'RODOAPP'
          AND Z05.Z05_CAMPO <> 'XX'
          AND Z05.D_E_L_E_T_ = ''

    /* Usuário do histórico */
    LEFT  JOIN SYS_USR  SYS_USR3    WITH (NOLOCK)
           ON  UPPER(TRIM(Z05.Z05_USER)) = UPPER(TRIM(SYS_USR3.USR_CODIGO))
          AND SYS_USR3.D_E_L_E_T_        = ''

    /* Títulos a pagar */
    LEFT  JOIN SE2010   SE2         WITH (NOLOCK)
           ON  SE2.E2_FILIAL  = SF1.F1_FILIAL
          AND SE2.E2_NUM     = SF1.F1_DOC
          AND SE2.E2_PREFIXO = SF1.F1_SERIE
          AND SE2.E2_FORNECE = SF1.F1_FORNECE
          AND SE2.E2_LOJA    = SF1.F1_LOJA
          AND SE2.D_E_L_E_T_ = ''

    WHERE SF1.D_E_L_E_T_ = ''
      AND SF1.F1_TIPO   <> 'D'
      AND SF1.F1_XUSRRA <> ''          -- somente pré-notas efetivamente lançadas
      AND SF1.R_E_C_N_O_ = ${recsf1}

    ORDER BY "DATA_ORDENACAO" ASC, Z05.Z05_HORA ASC;
  `;
}
