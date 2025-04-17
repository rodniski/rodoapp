import { Params, PrenotaResponse, PrenotaRow } from "./types";
import { PrismaClient } from "@prisma/client";
import {
  buildFilterConditions,
  buildSortingClause,
  serializeBigInts,
} from "./utils";

const prisma = new PrismaClient();

export async function getPrenotas({
  page,
  pageSize,
  filials,
  filters = {},
  sorting = [],
}: Params): Promise<PrenotaResponse> {
  const filiaisClause = filials.map((f) => `'${f}'`).join(",");
  const filtersClause = buildFilterConditions(filters);
  const sortClause = buildSortingClause(sorting, "main");
  const subquerySortClause = buildSortingClause(sorting, "subquery");
  const offset = (page - 1) * pageSize;

  const requiresVencimento = subquerySortClause.includes("VENCIMENTO");
  const requiresTotal = subquerySortClause.includes("F1_VALBRUT");
  const requiresFornece = subquerySortClause.includes("A2_NOME") || subquerySortClause.includes("FORNECE");

  const joinFornece = requiresFornece
    ? `LEFT JOIN SA2010 SA2 ON SA2.A2_COD = SF1.F1_FORNECE AND SA2.A2_LOJA = SF1.F1_LOJA AND SA2.D_E_L_E_T_ <> '*'
    `
    : "";

  const joinTotal = requiresTotal
    ? `LEFT JOIN (
        SELECT D1_FILIAL, D1_DOC, D1_SERIE, D1_FORNECE, D1_LOJA, D1_TIPO,
               SUM(D1_TOTAL) AS F1_VALBRUT
        FROM SD1010 WITH (NOLOCK)
        WHERE D_E_L_E_T_ <> '*'
        GROUP BY D1_FILIAL, D1_DOC, D1_SERIE, D1_FORNECE, D1_LOJA, D1_TIPO
      ) SD1_TOTAL
      ON SD1_TOTAL.D1_FILIAL = SF1.F1_FILIAL AND
         SD1_TOTAL.D1_DOC = SF1.F1_DOC AND
         SD1_TOTAL.D1_SERIE = SF1.F1_SERIE AND
         SD1_TOTAL.D1_FORNECE = SF1.F1_FORNECE AND
         SD1_TOTAL.D1_LOJA = SF1.F1_LOJA AND
         SD1_TOTAL.D1_TIPO = SF1.F1_TIPO
    `
    : "";

  const vencimentoSelect = requiresVencimento
    ? `(
        SELECT TOP 1 Z.Z10_VENCTO
        FROM Z10010 Z WITH (NOLOCK)
        WHERE Z.Z10_TIPO = 'Titulos'
          AND Z.Z10_CHAVE = (
            SF1.F1_FILIAL + SF1.F1_DOC + SF1.F1_SERIE + SF1.F1_FORNECE + SF1.F1_LOJA
          )
          AND Z.D_E_L_E_T_ <> '*'
        ORDER BY Z.Z10_VENCTO DESC
      ) AS VENCIMENTO,`
    : "";

  // 1. Busca os R_E_C_N_O_ paginados com ordenação dinâmica
  const recs = await prisma.$queryRawUnsafe<any[]>(`
    SELECT REC FROM (
      SELECT 
        SF1.R_E_C_N_O_ AS REC,
        ${vencimentoSelect}
        ROW_NUMBER() OVER (ORDER BY ${subquerySortClause}) AS RowNum
      FROM SF1010 SF1
      LEFT JOIN SF4010 SF4 ON SF4.F4_CODIGO = '1'
      ${joinFornece}
      ${joinTotal}
      WHERE 
        SF1.D_E_L_E_T_ <> '*' AND
        SF1.F1_DTDIGIT >= '20240601' AND
        SF1.F1_FILIAL IN (${filiaisClause}) AND
        (SF1.F1_XORI = 'rodoapp' OR SF4.F4_TRANFIL = '1')
        ${filtersClause}
    ) AS paged
    WHERE RowNum > ${offset} AND RowNum <= ${offset + pageSize}
    ORDER BY RowNum;
  `);

  const recValues = recs.map((r) => r.REC).join(",") || "NULL";

  // 2. Busca os dados detalhados com JOINs
  const prenotas = await prisma.$queryRawUnsafe<any[]>(`
    SELECT 
      SF1.R_E_C_N_O_ AS REC,
      ISNULL(SF4.F4_TRANFIL, '') AS F4_TRANFIL,
      SF1.F1_FILIAL,
      SF1.F1_DOC,
      SF1.F1_SERIE,
      SF1.F1_STATUS,
      SA2.A2_COD,
      SA2.A2_LOJA,
      SA2.A2_NOME,
      (SA2.A2_COD + ' ' + SA2.A2_LOJA + ' - ' + SA2.A2_NOME) AS FORNECE,
      SF1.F1_EMISSAO,
      SF1.F1_DTDIGIT,
      SD1_TOTAL.F1_VALBRUT,
      SF1.F1_XTIPO,
      SF1.F1_XPRIOR,
      SF1.F1_XORI,
      SF1.F1_XUSRRA,
      SF1.F1_XOBS,
      SF1.F1_ZOBSREV,
      SF1.F1_XREV,
      '' AS USUARIO,
      MAX(ISNULL(Z10.Z10_VENCTO, '')) AS VENCIMENTO,
      MAX(ISNULL(Z07.Z07_DESC, '')) AS Z07_DESC,
      MAX(ISNULL(Z07.Z07_CHAVE, '')) AS Z07_CHAVE
    FROM SF1010 SF1
    LEFT JOIN (
      SELECT D1_FILIAL, D1_DOC, D1_SERIE, D1_FORNECE, D1_LOJA, D1_TIPO,
             SUM(D1_TOTAL) AS F1_VALBRUT
      FROM SD1010 WITH (NOLOCK)
      WHERE D_E_L_E_T_ <> '*'
      GROUP BY D1_FILIAL, D1_DOC, D1_SERIE, D1_FORNECE, D1_LOJA, D1_TIPO
    ) SD1_TOTAL
      ON SD1_TOTAL.D1_FILIAL = SF1.F1_FILIAL AND
         SD1_TOTAL.D1_DOC = SF1.F1_DOC AND
         SD1_TOTAL.D1_SERIE = SF1.F1_SERIE AND
         SD1_TOTAL.D1_FORNECE = SF1.F1_FORNECE AND
         SD1_TOTAL.D1_LOJA = SF1.F1_LOJA AND
         SD1_TOTAL.D1_TIPO = SF1.F1_TIPO
    LEFT JOIN SF4010 SF4 WITH (NOLOCK)
      ON SF4.F4_CODIGO = '1' AND SF4.D_E_L_E_T_ <> '*'
    INNER JOIN SA2010 SA2 WITH (NOLOCK)
      ON SA2.A2_COD = SF1.F1_FORNECE AND SA2.A2_LOJA = SF1.F1_LOJA AND SA2.D_E_L_E_T_ <> '*'
    LEFT JOIN Z10010 Z10 WITH (NOLOCK)
      ON Z10.Z10_TIPO = 'Titulos' AND
         Z10.Z10_CHAVE = (SF1.F1_FILIAL + SF1.F1_DOC + SF1.F1_SERIE + SF1.F1_FORNECE + SF1.F1_LOJA) AND
         Z10.D_E_L_E_T_ <> '*'
    LEFT JOIN Z07010 Z07 WITH (NOLOCK)
      ON Z07.Z07_CHAVE = (SF1.F1_FILIAL + SF1.F1_DOC + SF1.F1_SERIE + SF1.F1_FORNECE + SF1.F1_LOJA)
    WHERE SF1.R_E_C_N_O_ IN (${recValues})
    GROUP BY
      SF1.R_E_C_N_O_,
      SF4.F4_TRANFIL,
      SF1.F1_FILIAL,
      SF1.F1_DOC,
      SF1.F1_SERIE,
      SF1.F1_STATUS,
      SA2.A2_COD,
      SA2.A2_LOJA,
      SA2.A2_NOME,
      SF1.F1_EMISSAO,
      SF1.F1_DTDIGIT,
      SD1_TOTAL.F1_VALBRUT,
      SF1.F1_XTIPO,
      SF1.F1_XPRIOR,
      SF1.F1_XORI,
      SF1.F1_XUSRRA,
      SF1.F1_XOBS,
      SF1.F1_ZOBSREV,
      SF1.F1_XREV
    ORDER BY ${sortClause};
  `);

  // 3. Total de registros
  const totalCountResult = await prisma.$queryRawUnsafe<any[]>(`
    SELECT COUNT(*) AS total FROM (
      SELECT SF1.R_E_C_N_O_
      FROM SF1010 SF1
      LEFT JOIN SF4010 SF4 ON SF4.F4_CODIGO = '1'
      WHERE 
        SF1.D_E_L_E_T_ <> '*' AND
        SF1.F1_DTDIGIT >= '20240601' AND
        SF1.F1_FILIAL IN (${filiaisClause}) AND
        (SF1.F1_XORI = 'rodoapp' OR SF4.F4_TRANFIL = '1')
        ${filtersClause}
      GROUP BY SF1.R_E_C_N_O_
    ) AS count_query;
  `);

  const totalCount = Number(totalCountResult[0]?.total ?? 0);
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data: serializeBigInts(prenotas) as PrenotaRow[],
    pagination: {
      page,
      pageSize,
      totalCount,
      totalPages,
    },
  };
}
