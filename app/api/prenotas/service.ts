/* app/api/prenotas/service.ts --------------------------------------- */
import { prisma } from "@/app/server/prisma";
import { logger } from "utils";

import * as QueryBuilder from "./query-builder";
import type { Params, PrenotaResponse, PrenotaRow } from "./types";

/* ───────────────────── logger local ───────────────────── */
const log = logger.child("prenotas-service"); // todas as msgs ficam tag-adas

/* ─────────────────── função principal ─────────────────── */
export async function getPrenotas({
  page = 1,
  pageSize = 10,
  filials,
  sorting = [],
  searchTerm = "",
  filters = {},
}: Params): Promise<PrenotaResponse> {
  log.info("Iniciando busca de pré-notas", {
    page, pageSize, filials, sorting, searchTerm, filters,
  });

  /* -------- validações rápidas -------- */
  if (!filials?.length) {
    log.warn("Abortado – nenhuma filial fornecida");
    return {
      data: [],
      pagination: { page: 1, pageSize: 0, totalCount: 0, totalPages: 0 },
      searchTerm: "",
    };
  }

  /* -------- normalização de parâmetros -------- */
  page      = Math.max(1, page);
  pageSize  = Math.max(1, pageSize);
  const offset         = (page - 1) * pageSize;
  const filiaisClause  = QueryBuilder.createSqlInClause(filials);

  /* -------- SQL dinâmico (filtros / ordenação) -------- */
  const {
    filterSql,           needsFornece: fFor, needsTotal: fTot,
    needsVencimento: fVen, needsZ07: fZ07,
  } = QueryBuilder.buildFilterConditions(filters);

  const {
    searchSql,           needsFornece: sFor, needsTotal: sTot,
    needsVencimento: sVen, needsZ07: sZ07,
  } = QueryBuilder.buildSearchCondition(searchTerm);

  const {
    sortClause: mainSort, needsFornece: oFor,
    needsTotal: oTot, needsVencimento: oVen, needsZ07: oZ07,
  } = QueryBuilder.buildSortingClause(sorting, "main");

  const { sortClause: subSort } =
    QueryBuilder.buildSortingClause(sorting, "subquery");

  const combinedFilterSql = filterSql + searchSql;

  /* -------- decide JOINs obrigatórios -------- */
  const joinReq = {
    needsFornece   : fFor || sFor || oFor,
    needsTotal     : fTot || sTot || oTot,
    needsVencimento: fVen || sVen || oVen,
    needsZ07       : fZ07 || sZ07 || oZ07,
  };
  log.debug("JOINs necessários", joinReq);

  const joins          = QueryBuilder.buildConditionalJoins(joinReq);
  const subquerySelect = QueryBuilder.buildSubquerySelectForSort(joinReq);

  /* ────────────── QUERY 1 – REC da página ────────────── */
  const vencimentoSubquery = `
    (SELECT TOP 1 Z.Z10_VENCTO
       FROM Z10010 Z WITH (NOLOCK)
      WHERE Z.Z10_TIPO = 'Titulos'
        AND Z.Z10_CHAVE = (SF1.F1_FILIAL + SF1.F1_DOC + SF1.F1_SERIE +
                            SF1.F1_FORNECE + SF1.F1_LOJA)
        AND Z.D_E_L_E_T_ <> '*'
      ORDER BY Z.Z10_VENCTO DESC)
  `;

  const customSort = sorting.find(s => s.id === "VENCIMENTO")
    ? `${vencimentoSubquery} ${sorting.find(s => s.desc) ? "DESC" : "ASC"}`
    : subSort;

  const sqlRecs = /* sql */ `
    SELECT REC FROM (
      SELECT
        SF1.R_E_C_N_O_ AS REC
        ${subquerySelect}
        , ROW_NUMBER() OVER (ORDER BY ${customSort}) AS RowNum
      FROM SF1010 SF1 WITH (NOLOCK)
      LEFT JOIN SF4010 SF4 WITH (NOLOCK)
             ON SF4.F4_CODIGO = '1' AND SF4.D_E_L_E_T_ <> '*'
      ${joins}
      WHERE SF1.D_E_L_E_T_ <> '*'
        AND SF1.F1_DTDIGIT >= '20240601'
        AND SF1.F1_FILIAL   IN ${filiaisClause}
        AND (SF1.F1_XORI = 'rodoapp' OR SF4.F4_TRANFIL = '1')
        ${combinedFilterSql}
    ) page
    WHERE RowNum > ${offset} AND RowNum <= ${offset + pageSize}
    ORDER BY RowNum;
  `;

  log.debug("SQL (REC)", sqlRecs);

  /** Etapa 1: lista de REC */
  let recs: { REC: number }[];
  try {
    recs = await prisma.$queryRawUnsafe(sqlRecs);
  } catch (err) {
    log.error(err, { stage: "REC-list" });
    throw new Error("Falha ao buscar registros paginados.");
  }

  /* ────────────── QUERY 2 – contagem total ────────────── */
  const totalCount = await countTotal(filiaisClause, combinedFilterSql, joinReq);
  const totalPages = pageSize ? Math.ceil(totalCount / pageSize) : 0;

  if (!recs.length) {
    log.info("Zero registros para a página solicitada");
    return {
      data: [],
      pagination: { page, pageSize, totalCount, totalPages },
      searchTerm,
    };
  }

  /* ────────────── QUERY 3 – detalhes finais ────────────── */
  const recIn   = QueryBuilder.createSqlInClause(recs.map(r => r.REC));
  const statusCase = QueryBuilder.statusCaseExpression;

  const sqlPrenotas = /* sql */ `
    SELECT
      SF1.R_E_C_N_O_ AS REC,
      ISNULL(SF4.F4_TRANFIL, '') AS F4_TRANFIL,
      SF1.F1_FILIAL, SF1.F1_DOC, SF1.F1_SERIE, SF1.F1_STATUS,
      SA2.A2_COD, SA2.A2_LOJA, SA2.A2_NOME,
      (SA2.A2_COD + ' ' + SA2.A2_LOJA + ' - ' + SA2.A2_NOME) AS FORNECE,
      SF1.F1_EMISSAO, SF1.F1_DTDIGIT,
      ISNULL(SD1_TOTAL.F1_VALBRUT, 0) AS F1_VALBRUT,
      SF1.F1_XTIPO, SF1.F1_XPRIOR, SF1.F1_XORI, SF1.F1_XUSRRA,
      SF1.F1_XOBS,  SF1.F1_ZOBSREV, SF1.F1_XREV,
      MAX(ISNULL(Z10.Z10_VENCTO, '')) AS VENCIMENTO,
      MAX(ISNULL(Z07.Z07_DESC , '')) AS Z07_DESC,
      MAX(ISNULL(Z07.Z07_CHAVE, '')) AS Z07_CHAVE,
      ${statusCase} AS Status
    FROM SF1010 SF1 WITH (NOLOCK)
    LEFT JOIN SF4010 SF4 WITH (NOLOCK)
           ON SF4.F4_CODIGO = '1' AND SF4.D_E_L_E_T_ <> '*'
    INNER JOIN SA2010 SA2 WITH (NOLOCK)
           ON SA2.A2_COD = SF1.F1_FORNECE AND SA2.A2_LOJA = SF1.F1_LOJA
          AND SA2.D_E_L_E_T_ <> '*'
    LEFT JOIN (
       SELECT D1_FILIAL,D1_DOC,D1_SERIE,D1_FORNECE,D1_LOJA,D1_TIPO,
              SUM(D1_TOTAL) AS F1_VALBRUT
         FROM SD1010 WITH (NOLOCK)
        WHERE D_E_L_E_T_ <> '*'
        GROUP BY D1_FILIAL,D1_DOC,D1_SERIE,D1_FORNECE,D1_LOJA,D1_TIPO
    ) SD1_TOTAL
           ON SD1_TOTAL.D1_FILIAL = SF1.F1_FILIAL
          AND SD1_TOTAL.D1_DOC    = SF1.F1_DOC
          AND SD1_TOTAL.D1_SERIE  = SF1.F1_SERIE
          AND SD1_TOTAL.D1_FORNECE= SF1.F1_FORNECE
          AND SD1_TOTAL.D1_LOJA   = SF1.F1_LOJA
          AND SD1_TOTAL.D1_TIPO   = SF1.F1_TIPO
    LEFT JOIN Z10010 Z10 WITH (NOLOCK)
           ON Z10.Z10_TIPO = 'Titulos'
          AND Z10.Z10_CHAVE = (SF1.F1_FILIAL + SF1.F1_DOC + SF1.F1_SERIE +
                               SF1.F1_FORNECE + SF1.F1_LOJA)
          AND Z10.D_E_L_E_T_ <> '*'
    LEFT JOIN Z07010 Z07 WITH (NOLOCK)
           ON Z07.Z07_CHAVE = (SF1.F1_FILIAL + SF1.F1_DOC + SF1.F1_SERIE +
                               SF1.F1_FORNECE + SF1.F1_LOJA)
          AND Z07.D_E_L_E_T_ <> '*'
    WHERE SF1.R_E_C_N_O_ IN ${recIn} AND SF1.D_E_L_E_T_ <> '*'
    GROUP BY
      SF1.R_E_C_N_O_, SF4.F4_TRANFIL,
      SF1.F1_FILIAL,  SF1.F1_DOC,   SF1.F1_SERIE,   SF1.F1_STATUS,
      SA2.A2_COD,     SA2.A2_LOJA,  SA2.A2_NOME,
      SF1.F1_EMISSAO, SF1.F1_DTDIGIT, SD1_TOTAL.F1_VALBRUT,
      SF1.F1_XTIPO,   SF1.F1_XPRIOR, SF1.F1_XORI, SF1.F1_XUSRRA,
      SF1.F1_XOBS,    SF1.F1_ZOBSREV, SF1.F1_XREV
    ORDER BY ${mainSort};
  `;

  log.debug("SQL (detalhes)", sqlPrenotas);

  type Raw = Omit<PrenotaRow, "REC" | "F1_VALBRUT"> & {
    REC: bigint | number;
    F1_VALBRUT: number | null;
  };

  let rows: Raw[];
  try {
    rows = await prisma.$queryRawUnsafe(sqlPrenotas);
  } catch (err) {
    log.error(err, { stage: "detail-fetch" });
    throw new Error("Falha ao buscar detalhes dos registros.");
  }

  const data = rows.map< PrenotaRow >(r => ({
    REC        : Number(r.REC),
    F4_TRANFIL : String(r.F4_TRANFIL ?? ""),
    F1_FILIAL  : String(r.F1_FILIAL ?? ""),
    F1_DOC     : String(r.F1_DOC ?? ""),
    F1_SERIE   : String(r.F1_SERIE ?? ""),
    F1_STATUS  : String(r.F1_STATUS ?? ""),
    A2_COD     : String(r.A2_COD ?? ""),
    A2_LOJA    : String(r.A2_LOJA ?? ""),
    A2_NOME    : String(r.A2_NOME ?? ""),
    FORNECE    : String(r.FORNECE ?? ""),
    F1_EMISSAO : String(r.F1_EMISSAO ?? ""),
    F1_DTDIGIT : String(r.F1_DTDIGIT ?? ""),
    F1_VALBRUT : Number(r.F1_VALBRUT ?? 0),
    F1_XTIPO   : String(r.F1_XTIPO ?? ""),
    F1_XPRIOR  : String(r.F1_XPRIOR ?? ""),
    F1_XORI    : String(r.F1_XORI ?? ""),
    F1_XUSRRA  : String(r.F1_XUSRRA ?? ""),
    F1_XOBS    : String(r.F1_XOBS ?? ""),
    F1_ZOBSREV : String(r.F1_ZOBSREV ?? ""),
    F1_XREV    : String(r.F1_XREV ?? ""),
    USUARIO    : String(r.F1_XUSRRA ?? ""),
    VENCIMENTO : String(r.VENCIMENTO ?? ""),
    Z07_DESC   : String(r.Z07_DESC ?? ""),
    Z07_CHAVE  : String(r.Z07_CHAVE ?? ""),
    Status     : String(r.Status ?? "Pendente"),
  }));

  log.success(`Busca concluída: ${data.length}/${totalCount} registros`);

  return {
    data,
    pagination: { page, pageSize, totalCount, totalPages },
    searchTerm,
  };
}

/* ─────────────────── contagem total isolada ─────────────────── */
async function countTotal(
  filiaisClause: string,
  combinedWhere: string,
  joins: QueryBuilder.JoinRequirements
): Promise<number> {
  const sql = /* sql */ `
    SELECT COUNT_BIG(*) AS total
      FROM SF1010 SF1 WITH (NOLOCK)
      LEFT JOIN SF4010 SF4 WITH (NOLOCK)
             ON SF4.F4_CODIGO = '1' AND SF4.D_E_L_E_T_ <> '*'
      ${QueryBuilder.buildConditionalJoins(joins)}
     WHERE SF1.D_E_L_E_T_ <> '*'
       AND SF1.F1_DTDIGIT >= '20240601'
       AND SF1.F1_FILIAL   IN ${filiaisClause}
       AND (SF1.F1_XORI = 'rodoapp' OR SF4.F4_TRANFIL = '1')
       ${combinedWhere};
  `;
  log.debug("SQL (count)", sql);

  const res = await prisma.$queryRawUnsafe<{ total: bigint | number }[]>(sql);
  return Number(res[0]?.total ?? 0);
}
