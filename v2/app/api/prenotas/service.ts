// app/api/prenotas/service.ts
import { Params, PrenotaResponse, PrenotaRow } from "./types";
import { prisma } from "@/app/server/prisma";
// Importa as funções e constantes do novo arquivo helper
import * as QueryBuilder from "./query-builder";

// --------------------------------------------------------------------------
// Função Principal de Busca (Mais Limpa)
// --------------------------------------------------------------------------
export async function getPrenotas({
  page = 1,
  pageSize = 10,
  filials,
  sorting = [],
  searchTerm = "",
  filters = {},
}: Params): Promise<PrenotaResponse> {
  const logPrefix = "[getPrenotas]";
  console.groupCollapsed(`${logPrefix} Executando Busca`);
  console.log("Params:", {
    page,
    pageSize,
    filials,
    sorting,
    searchTerm,
    filters,
  });

  if (!filials?.length) {
    console.warn(`${logPrefix} Abortado: Nenhuma filial fornecida.`);
    console.groupEnd();
    return {
      data: [],
      pagination: { page: 1, pageSize: 0, totalCount: 0, totalPages: 0 },
      searchTerm: "",
    };
  }

  // --- Preparação ---
  page = Math.max(1, page);
  pageSize = Math.max(1, pageSize);
  const filiaisClause = QueryBuilder.createSqlInClause(filials);
  const offset = (page - 1) * pageSize;

  // --- Construção das Cláusulas WHERE e ORDER BY ---
  const {
    filterSql,
    needsFornece: filterReqFornece,
    needsTotal: filterReqTotal,
    needsVencimento: filterReqVenc,
    needsZ07: filterReqZ07,
  } = QueryBuilder.buildFilterConditions(filters);
  const {
    searchSql,
    needsFornece: searchReqFornece,
    needsTotal: searchReqTotal,
    needsVencimento: searchReqVenc,
    needsZ07: searchReqZ07,
  } = QueryBuilder.buildSearchCondition(searchTerm);
  const {
    sortClause: mainSortClause,
    needsFornece: sortReqFornece,
    needsTotal: sortReqTotal,
    needsVencimento: sortReqVenc,
    needsZ07: sortReqZ07,
  } = QueryBuilder.buildSortingClause(sorting, "main");
  const { sortClause: subquerySortClause } = QueryBuilder.buildSortingClause(
    sorting,
    "subquery"
  ); // Flags de JOIN da ordenação já capturadas acima

  const combinedFilterSql = filterSql + searchSql;

  // --- Determinação Final de JOINs necessários (para REC e COUNT) ---
  const joinRequirements = {
    needsFornece: filterReqFornece || searchReqFornece || sortReqFornece,
    needsTotal: filterReqTotal || searchReqTotal || sortReqTotal,
    needsVencimento: filterReqVenc || searchReqVenc || sortReqVenc,
    needsZ07: filterReqZ07 || searchReqZ07 || sortReqZ07,
  };
  console.debug("Necessidade de JOINs (REC/COUNT):", joinRequirements);

  // --- Construção das Cláusulas JOIN Condicionais ---
  const conditionalJoins = QueryBuilder.buildConditionalJoins(joinRequirements);
  // --- Seleção Condicional de Colunas Agregadas na Subquery ---
  const subqueryAggSelects =
    QueryBuilder.buildSubquerySelectForSort(joinRequirements);

  // --- Query 1: Buscar RECNOs da Página Atual ---
  const queryRecsSQL = `
    SELECT REC FROM (
      SELECT
        SF1.R_E_C_N_O_ AS REC
        ${subqueryAggSelects} -- Inclui VENCIMENTO/Z07 apenas se necessário ordenar por eles
        , ROW_NUMBER() OVER (ORDER BY ${subquerySortClause}) AS RowNum -- Aplica ordenação AQUI
      FROM SF1010 SF1 WITH (NOLOCK)
      LEFT JOIN SF4010 SF4 WITH (NOLOCK) ON SF4.F4_CODIGO = '1' AND SF4.D_E_L_E_T_ <> '*' -- Join base
      ${conditionalJoins} -- Todos os JOINs condicionais (SA2, SD1_TOTAL, Z10, Z07)
      WHERE
        SF1.D_E_L_E_T_ <> '*'
        AND SF1.F1_DTDIGIT >= '20240601' -- Condição base de data (ajustar se necessário)
        AND SF1.F1_FILIAL IN ${filiaisClause}
        AND (SF1.F1_XORI = 'rodoapp' OR SF4.F4_TRANFIL = '1') -- Condição base de origem
        ${combinedFilterSql} -- Filtros específicos + Busca genérica
    ) AS paged
    WHERE RowNum > ${offset} AND RowNum <= ${offset + pageSize}
    ORDER BY RowNum ASC;
  `;

  console.log("----- DEBUG SQL Query (recs) -----");
  console.log(queryRecsSQL);
  console.log("----- END DEBUG SQL Query -----");

  let recs: { REC: number }[];
  try {
    recs = await prisma.$queryRawUnsafe<{ REC: number }[]>(queryRecsSQL);
  } catch (error) {
    console.error(`${logPrefix} Erro ao buscar RECNOs:`, error);
    console.error("SQL Falhou:", queryRecsSQL);
    console.groupEnd();
    throw new Error(
      `Falha ao buscar registros paginados. ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  // --- Query 2: Contagem Total de Registros com Filtros ---
  // Passa as flags de join já calculadas para a função de contagem
  const totalCount = await getTotalCount(
    filiaisClause,
    combinedFilterSql,
    joinRequirements
  );
  const totalPages = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 0;

  // Se não encontrou registros para a página, retorna vazio cedo
  if (!recs.length) {
    console.log(`${logPrefix} Nenhum registro encontrado para a página atual.`);
    console.groupEnd();
    return {
      data: [],
      pagination: { page, pageSize, totalCount, totalPages },
      searchTerm,
    };
  }

  // --- Query 3: Buscar Detalhes Completos pelos RECNOs ---
  const recValues = QueryBuilder.createSqlInClause(recs.map((r) => r.REC)); // Usa helper para IN clause
  // A query principal SEMPRE inclui todos os JOINs para selecionar todas as colunas necessárias
  const queryPrenotasSQL = `
    SELECT
      SF1.R_E_C_N_O_ AS REC,
      ISNULL(SF4.F4_TRANFIL, '') AS F4_TRANFIL,
      SF1.F1_FILIAL, SF1.F1_DOC, SF1.F1_SERIE, SF1.F1_STATUS,
      SA2.A2_COD, SA2.A2_LOJA, SA2.A2_NOME,
      (SA2.A2_COD + ' ' + SA2.A2_LOJA + ' - ' + SA2.A2_NOME) AS FORNECE,
      SF1.F1_EMISSAO, SF1.F1_DTDIGIT,
      ISNULL(SD1_TOTAL.F1_VALBRUT, 0) AS F1_VALBRUT,
      SF1.F1_XTIPO, SF1.F1_XPRIOR, SF1.F1_XORI, SF1.F1_XUSRRA, -- Incluído F1_XUSRRA
      SF1.F1_XOBS, SF1.F1_ZOBSREV, SF1.F1_XREV,
      MAX(ISNULL(Z10.Z10_VENCTO, '')) AS VENCIMENTO,
      MAX(ISNULL(Z07.Z07_DESC, '')) AS Z07_DESC,
      MAX(ISNULL(Z07.Z07_CHAVE, '')) AS Z07_CHAVE,
      ${QueryBuilder.statusCaseExpression} AS Status
    FROM SF1010 SF1 WITH (NOLOCK)
    -- JOINs Fixos (necessários para SELECT) --
    LEFT JOIN SF4010 SF4 WITH (NOLOCK) ON SF4.F4_CODIGO = '1' AND SF4.D_E_L_E_T_ <> '*'
    INNER JOIN SA2010 SA2 WITH (NOLOCK) ON SA2.A2_COD = SF1.F1_FORNECE AND SA2.A2_LOJA = SF1.F1_LOJA AND SA2.D_E_L_E_T_ <> '*'
    LEFT JOIN ( SELECT D1_FILIAL, D1_DOC, D1_SERIE, D1_FORNECE, D1_LOJA, D1_TIPO, SUM(D1_TOTAL) AS F1_VALBRUT FROM SD1010 WITH (NOLOCK) WHERE D_E_L_E_T_ <> '*' GROUP BY D1_FILIAL, D1_DOC, D1_SERIE, D1_FORNECE, D1_LOJA, D1_TIPO ) SD1_TOTAL ON SD1_TOTAL.D1_FILIAL = SF1.F1_FILIAL AND SD1_TOTAL.D1_DOC = SF1.F1_DOC AND SD1_TOTAL.D1_SERIE = SF1.F1_SERIE AND SD1_TOTAL.D1_FORNECE = SF1.F1_FORNECE AND SD1_TOTAL.D1_LOJA = SF1.F1_LOJA AND SD1_TOTAL.D1_TIPO = SF1.F1_TIPO
    LEFT JOIN Z10010 Z10 WITH (NOLOCK) ON Z10.Z10_TIPO = 'Titulos' AND Z10.Z10_CHAVE = (SF1.F1_FILIAL + SF1.F1_DOC + SF1.F1_SERIE + SF1.F1_FORNECE + SF1.F1_LOJA) AND Z10.D_E_L_E_T_ <> '*'
    LEFT JOIN Z07010 Z07 WITH (NOLOCK) ON Z07.Z07_CHAVE = (SF1.F1_FILIAL + SF1.F1_DOC + SF1.F1_SERIE + SF1.F1_FORNECE + SF1.F1_LOJA) AND Z07.D_E_L_E_T_ <> '*'
    -- Filtra apenas pelos RECs da página atual --
    WHERE SF1.R_E_C_N_O_ IN ${recValues} AND SF1.D_E_L_E_T_ <> '*'
    -- Agrupa para permitir as funções MAX() --
    GROUP BY
      SF1.R_E_C_N_O_, SF4.F4_TRANFIL, SF1.F1_FILIAL, SF1.F1_DOC, SF1.F1_SERIE, SF1.F1_STATUS,
      SA2.A2_COD, SA2.A2_LOJA, SA2.A2_NOME, SF1.F1_EMISSAO, SF1.F1_DTDIGIT, SD1_TOTAL.F1_VALBRUT,
      SF1.F1_XTIPO, SF1.F1_XPRIOR, SF1.F1_XORI, SF1.F1_XUSRRA, SF1.F1_XOBS, SF1.F1_ZOBSREV, SF1.F1_XREV
    -- Ordena o resultado final --
    ORDER BY ${mainSortClause};
  `;

  console.log("----- DEBUG SQL Query (prenotas) -----");
  console.log(queryPrenotasSQL);
  console.log("----- END DEBUG SQL Query -----");

  // Define um tipo mais seguro para o resultado Raw, se possível
  type PrenotaRawResult = Omit<PrenotaRow, "REC" | "F1_VALBRUT"> & {
    REC: bigint | number;
    F1_VALBRUT?: number | null;
  };

  let prenotas: PrenotaRawResult[];
  try {
    // Tenta usar a tipagem mais específica com $queryRawUnsafe
    prenotas = await prisma.$queryRawUnsafe<PrenotaRawResult[]>(
      queryPrenotasSQL
    );
  } catch (error) {
    console.error(`${logPrefix} Erro ao buscar detalhes das Prenotas:`, error);
    console.error("SQL Falhou:", queryPrenotasSQL);
    console.groupEnd();
    throw new Error(
      `Falha ao buscar detalhes dos registros. ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }

  // Mapeia e serializa o resultado final para o tipo PrenotaRow
  const serializedPrenotas = prenotas.map(
    (row): PrenotaRow => ({
      REC: Number(row.REC), // Garante que REC seja number
      F4_TRANFIL: String(row.F4_TRANFIL ?? ""),
      F1_FILIAL: String(row.F1_FILIAL ?? ""),
      F1_DOC: String(row.F1_DOC ?? ""),
      F1_SERIE: String(row.F1_SERIE ?? ""),
      F1_STATUS: String(row.F1_STATUS ?? ""),
      A2_COD: String(row.A2_COD ?? ""),
      A2_LOJA: String(row.A2_LOJA ?? ""),
      A2_NOME: String(row.A2_NOME ?? ""),
      FORNECE: String(row.FORNECE ?? ""),
      F1_EMISSAO: String(row.F1_EMISSAO ?? ""),
      F1_DTDIGIT: String(row.F1_DTDIGIT ?? ""),
      F1_VALBRUT: row.F1_VALBRUT ? Number(row.F1_VALBRUT) : 0, // Garante number ou 0
      F1_XTIPO: String(row.F1_XTIPO ?? ""),
      F1_XPRIOR: String(row.F1_XPRIOR ?? ""),
      F1_XORI: String(row.F1_XORI ?? ""),
      F1_XUSRRA: String(row.F1_XUSRRA ?? ""),
      F1_XOBS: String(row.F1_XOBS ?? ""),
      F1_ZOBSREV: String(row.F1_ZOBSREV ?? ""),
      F1_XREV: String(row.F1_XREV ?? ""),
      USUARIO: String(row.F1_XUSRRA ?? ""), // Mapeia F1_XUSRRA para USUARIO
      VENCIMENTO: String(row.VENCIMENTO ?? ""),
      Z07_DESC: String(row.Z07_DESC ?? ""),
      Z07_CHAVE: String(row.Z07_CHAVE ?? ""),
      Status: String(row.Status ?? "Pendente"),
    })
  );

  console.log(
    `${logPrefix} Busca concluída. Retornando ${serializedPrenotas.length} de ${totalCount} registros.`
  );
  console.groupEnd();

  return {
    data: serializedPrenotas,
    pagination: { page, pageSize, totalCount, totalPages },
    searchTerm,
  };
}

// --------------------------------------------------------------------------
// Função Auxiliar de Contagem Total (Refatorada)
// --------------------------------------------------------------------------
async function getTotalCount(
  filiaisClause: string, // Mudado para string já formatada
  combinedFilterSql: string,
  joinRequirements: QueryBuilder.JoinRequirements // Recebe as flags de join calculadas
): Promise<number> {
  const logPrefix = "[getTotalCount]";

  // Constrói os JOINs necessários para a contagem (baseado nas flags)
  const conditionalJoins = QueryBuilder.buildConditionalJoins(joinRequirements);

  const queryCountSQL = `
    SELECT COUNT_BIG(*) AS total
    FROM SF1010 SF1 WITH (NOLOCK)
    LEFT JOIN SF4010 SF4 WITH (NOLOCK) ON SF4.F4_CODIGO = '1' AND SF4.D_E_L_E_T_ <> '*' -- Join base
    ${conditionalJoins} -- JOINs condicionais (SA2, SD1_TOTAL, Z10, Z07)
    WHERE
      SF1.D_E_L_E_T_ <> '*'
      AND SF1.F1_DTDIGIT >= '20240601' -- Condição base de data
      AND SF1.F1_FILIAL IN ${filiaisClause} -- Usa a cláusula IN pré-formatada
      AND (SF1.F1_XORI = 'rodoapp' OR SF4.F4_TRANFIL = '1') -- Condição base de origem
      ${combinedFilterSql} -- Filtros específicos + Busca genérica
  `;

  console.log("----- DEBUG SQL Query (count) -----");
  console.log(queryCountSQL);
  console.log("----- END DEBUG SQL Query -----");

  try {
    const result = await prisma.$queryRawUnsafe<{ total: bigint | number }[]>(
      queryCountSQL
    );
    const total = Number(result[0]?.total ?? 0);
    console.log(`${logPrefix} Contagem total: ${total}`);
    return total;
  } catch (error) {
    console.error(`${logPrefix} Erro ao contar registros:`, error);
    console.error("SQL Falhou:", queryCountSQL);
    throw new Error(
      `Falha ao buscar contagem total. ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
