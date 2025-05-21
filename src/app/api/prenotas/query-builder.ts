// app/api/prenotas/query-builder.ts
/**
 * @file Funções auxiliares para construir queries SQL dinâmicas para a busca de Pré-Notas.
 * @description Contém mapeamentos de colunas, constantes e funções para gerar cláusulas WHERE, ORDER BY e determinar JOINs necessários.
 */

import type { PrenotaRow } from "./types"; // Importa a interface para tipagem dos mappers

// --------------------------------------------------------------------------
// Utilitários SQL Seguros
// --------------------------------------------------------------------------

export function escapeSqlLike(value: string): string {
  // Escapa caracteres para cláusulas LIKE: ', %, _
  // Usa a substituição padrão do SQL Server para % e _ dentro de []
  return value.replace(/'/g, "''").replace(/%/g, "[%]").replace(/_/g, "[_]");
}

export function createSqlInClause(values: Array<string | number>): string {
  // Cria cláusula IN ('val1', 'val2', 123) segura contra SQL Injection básico
  if (!values || !values.length) {
    // Condição que sempre será falsa para evitar erros com IN ()
    return "('__EMPTY_IN_CLAUSE__')"; // Adiciona parênteses para sintaxe correta
  }
  // Escapa aspas simples para strings, números são convertidos diretamente
  const escapedValues = values
    .map((v) =>
      typeof v === "string" ? `'${v.replace(/'/g, "''")}'` : String(v)
    )
    .join(",");
  return `(${escapedValues})`;
}

// --------------------------------------------------------------------------
// Constantes e Mapeamentos
// --------------------------------------------------------------------------

// Expressão CASE para calcular o Status consistentemente
export const statusCaseExpression = `CASE
  WHEN SF1.F1_STATUS <> '' THEN 'Classificada'
  WHEN SF1.F1_XREV <> '' THEN 'Revisar'
  ELSE 'Pendente'
END`;

// Mapeamento COMPLETO para ORDENAÇÃO (Frontend ID -> SQL Expression)
// Usado por buildSortingClause
export const sortColumnMap: Record<keyof PrenotaRow | "Status", string> = {
  REC: "SF1.R_E_C_N_O_",
  F4_TRANFIL: "SF4.F4_TRANFIL",
  F1_FILIAL: "SF1.F1_FILIAL",
  F1_DOC: "SF1.F1_DOC",
  F1_SERIE: "SF1.F1_SERIE",
  F1_STATUS: "SF1.F1_STATUS", // Campo original
  Status: statusCaseExpression, // Campo calculado
  A2_COD: "SA2.A2_COD",
  A2_LOJA: "SA2.A2_LOJA",
  A2_NOME: "SA2.A2_NOME",
  FORNECE: "(SA2.A2_COD + ' ' + SA2.A2_LOJA + ' - ' + SA2.A2_NOME)",
  F1_EMISSAO: "SF1.F1_EMISSAO",
  F1_DTDIGIT: "SF1.F1_DTDIGIT",
  F1_VALBRUT: "SD1_TOTAL.F1_VALBRUT",
  F1_XTIPO: "SF1.F1_XTIPO",
  F1_XPRIOR: "SF1.F1_XPRIOR",
  F1_XORI: "SF1.F1_XORI",
  F1_XUSRRA: "SF1.F1_XUSRRA",
  USUARIO: "SF1.F1_XUSRRA",
  F1_XOBS: "SF1.F1_XOBS",
  F1_ZOBSREV: "SF1.F1_ZOBSREV",
  F1_XREV: "SF1.F1_XREV",
  VENCIMENTO: "VENCIMENTO", // Campo agregado/calculado
  Z07_DESC: "Z07_DESC", // Campo agregado/calculado
  Z07_CHAVE: "Z07_CHAVE", // Campo agregado/calculado
};

// Tipo de filtro para flexibilidade
type FilterType =
  | "exact"
  | "like"
  | "dateRange"
  | "numberRange"
  | "in"
  | "statusCondition";
type RequiredJoin = "fornece" | "total" | "vencimento" | "z07";

// Mapeamento COMPLETO para FILTRAGEM (Frontend ID -> Configuração do Filtro)
// Usado por buildFilterConditions
export const filterFieldMap: Record<
  keyof PrenotaRow | "Status",
  {
    column: string; // Coluna SQL ou identificador especial
    type: FilterType;
    requiresJoin?: RequiredJoin; // Indica qual JOIN é necessário
  }
> = {
  REC: { column: "SF1.R_E_C_N_O_", type: "in" },
  F4_TRANFIL: { column: "SF4.F4_TRANFIL", type: "in" },
  F1_FILIAL: { column: "SF1.F1_FILIAL", type: "in" },
  F1_DOC: { column: "SF1.F1_DOC", type: "like" },
  F1_SERIE: { column: "SF1.F1_SERIE", type: "in" },
  F1_STATUS: { column: "SF1.F1_STATUS", type: "in" }, // Campo original
  Status: { column: "calculated_status", type: "statusCondition" }, // Campo calculado
  A2_COD: { column: "SA2.A2_COD", type: "in", requiresJoin: "fornece" },
  A2_LOJA: { column: "SA2.A2_LOJA", type: "in", requiresJoin: "fornece" },
  A2_NOME: { column: "SA2.A2_NOME", type: "like", requiresJoin: "fornece" },
  FORNECE: {
    column: "(SA2.A2_COD + ' ' + SA2.A2_LOJA + ' - ' + SA2.A2_NOME)",
    type: "like",
    requiresJoin: "fornece",
  },
  F1_EMISSAO: { column: "SF1.F1_EMISSAO", type: "dateRange" },
  F1_DTDIGIT: { column: "SF1.F1_DTDIGIT", type: "dateRange" },
  F1_VALBRUT: {
    column: "SD1_TOTAL.F1_VALBRUT",
    type: "numberRange",
    requiresJoin: "total",
  },
  F1_XTIPO: { column: "SF1.F1_XTIPO", type: "in" },
  F1_XPRIOR: { column: "SF1.F1_XPRIOR", type: "in" },
  F1_XORI: { column: "SF1.F1_XORI", type: "in" },
  F1_XUSRRA: { column: "SF1.F1_XUSRRA", type: "like" },
  USUARIO: { column: "SF1.F1_XUSRRA", type: "like" }, // Mapeia USUARIO
  F1_XOBS: { column: "SF1.F1_XOBS", type: "like" },
  F1_ZOBSREV: { column: "SF1.F1_ZOBSREV", type: "like" },
  F1_XREV: { column: "SF1.F1_XREV", type: "in" },
  VENCIMENTO: {
    column: "Z10.Z10_VENCTO",
    type: "dateRange",
    requiresJoin: "vencimento",
  }, // Filtra na tabela base Z10
  Z07_DESC: { column: "Z07.Z07_DESC", type: "like", requiresJoin: "z07" }, // Filtra na tabela base Z07
  Z07_CHAVE: { column: "Z07.Z07_CHAVE", type: "like", requiresJoin: "z07" }, // Filtra na tabela base Z07
};

// Colunas usadas na busca genérica (searchTerm)
export const searchColumns = [
  "SF1.F1_DOC",
  "SF1.F1_SERIE",
  "SA2.A2_NOME",
  "SA2.A2_COD",
  "SF1.F1_CHVNF",
  "SF1.F1_XOBS",
  "SF1.F1_ZOBSREV",
  "SF1.F1_XUSRRA",
  "SD1_TOTAL.F1_VALBRUT",
];

// Tipo para retornar as flags de JOIN necessárias
export interface JoinRequirements {
  needsFornece: boolean;
  needsTotal: boolean;
  needsVencimento: boolean;
  needsZ07: boolean;
}

// --------------------------------------------------------------------------
// Funções de Construção de Cláusulas SQL
// --------------------------------------------------------------------------

/** Constrói a cláusula ORDER BY e identifica JOINs necessários para ordenação */
export function buildSortingClause(
  sorting: { id: string; desc: boolean }[],
  context: "main" | "subquery"
): { sortClause: string } & JoinRequirements {
  const requirements: JoinRequirements = {
    needsFornece: false,
    needsTotal: false,
    needsVencimento: false,
    needsZ07: false,
  };

  if (!sorting.length) {
    const defaultSort =
      context === "subquery" ? "SF1.R_E_C_N_O_ DESC" : "SF1.R_E_C_N_O_ ASC";
    return { sortClause: defaultSort, ...requirements };
  }

  const sortParts = sorting.map(({ id, desc }) => {
    const sortKey = id as keyof PrenotaRow | "Status";
    let columnExpression = sortColumnMap[sortKey];

    if (!columnExpression) {
      console.warn(
        `[buildSortingClause] Coluna de ordenação não mapeada: ${id}. Usando SF1.${id}.`
      );
      columnExpression = `SF1.${id}`;
    }

    // Verifica JOINs necessários para a coluna de ordenação
    if (columnExpression.includes("SA2.")) requirements.needsFornece = true;
    if (columnExpression.includes("SD1_TOTAL.")) requirements.needsTotal = true;
    if (sortKey === "VENCIMENTO") {
      requirements.needsVencimento = true;
      columnExpression =
        context === "main" ? "MAX(ISNULL(Z10.Z10_VENCTO, ''))" : "VENCIMENTO";
    }
    if (sortKey === "Z07_DESC") {
      requirements.needsZ07 = true;
      columnExpression =
        context === "main" ? "MAX(ISNULL(Z07.Z07_DESC, ''))" : "Z07_DESC";
    }
    if (sortKey === "Z07_CHAVE") {
      requirements.needsZ07 = true;
      columnExpression =
        context === "main" ? "MAX(ISNULL(Z07.Z07_CHAVE, ''))" : "Z07_CHAVE";
    }

    return `${columnExpression} ${desc ? "DESC" : "ASC"}`;
  });

  return {
    sortClause: sortParts.join(", "),
    ...requirements,
  };
}

/** Constrói as condições WHERE para filtros específicos e identifica JOINs */
export function buildFilterConditions(
  filters: Record<string, any>
): { filterSql: string } & JoinRequirements {
  const requirements: JoinRequirements = {
    needsFornece: false,
    needsTotal: false,
    needsVencimento: false,
    needsZ07: false,
  };

  let filterSql = "";
  const conditions: string[] = [];

  // 1. Processa TODOS os filtros no loop
  for (const [field, value] of Object.entries(filters)) {
    const filterKey = field as keyof PrenotaRow | "Status";
    const fieldConfig = filterFieldMap[filterKey];
    if (
      !fieldConfig ||
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && !value.length)
    ) {
      continue; // Pula filtro inválido/vazio
    }

    const { column, type, requiresJoin } = fieldConfig;

    // Marca JOINs necessários (acumula durante o loop)
    if (requiresJoin === "fornece") requirements.needsFornece = true;
    if (requiresJoin === "total") requirements.needsTotal = true;
    if (requiresJoin === "vencimento") requirements.needsVencimento = true;
    if (requiresJoin === "z07") requirements.needsZ07 = true;

    // Constrói a condição específica para este filtro
    let currentCondition = ""; // Armazena a condição do filtro atual
    switch (type) {
      case "like":
        if (typeof value === "string" && value.trim()) {
          currentCondition = `LOWER(${column}) LIKE LOWER('%${escapeSqlLike(
            value.trim()
          )}%')`;
        }
        break;
      case "exact":
        if (typeof value === "string" || typeof value === "number") {
          currentCondition = `${column} = ${
            typeof value === "string" ? `'${value.replace(/'/g, "''")}'` : value
          }`;
        }
        break;
      case "in":
        if (Array.isArray(value) && value.length > 0) {
          currentCondition = `${column} IN ${createSqlInClause(value)}`;
        }
        break;
      case "dateRange":
      case "numberRange":
        if (
          typeof value === "object" &&
          value !== null &&
          (value.from || value.to)
        ) {
          const rangeConditions: string[] = [];
          const formatValue = (val: any) =>
            type === "dateRange" ? `'${String(val)}'` : Number(val);
          if (value.from)
            rangeConditions.push(`${column} >= ${formatValue(value.from)}`);
          if (value.to)
            rangeConditions.push(`${column} <= ${formatValue(value.to)}`);
          if (rangeConditions.length)
            currentCondition = `(${rangeConditions.join(" AND ")})`;
        }
        break;
      case "statusCondition":
        if (Array.isArray(value) && value.length > 0) {
          const mappedConditions = value.map((status) => {
            // ... (lógica do map como antes, retornando '' para inválido) ...
            if (status === "Classificada") return `(SF1.F1_STATUS <> '')`;
            if (status === "Revisar")
              return `(SF1.F1_STATUS = '' AND SF1.F1_XREV <> '')`;
            if (status === "Pendente")
              return `(SF1.F1_STATUS = '' AND SF1.F1_XREV = '')`;
            console.warn(
              `[buildFilterConditions] Status inválido recebido no filtro: ${status}`
            );
            return "";
          });
          const statusConditions = mappedConditions.filter(Boolean); // Filtra vazios
          if (statusConditions.length > 0)
            currentCondition = `(${statusConditions.join(" OR ")})`;
        }
        break;
    }
    // Adiciona a condição válida ao array de condições
    if (currentCondition) {
      conditions.push(currentCondition);
    }
  } // <-- Fim do loop FOR

  // 2. Monta o SQL final APÓS o loop
  if (conditions.length > 0) {
    filterSql = ` AND ${conditions.join(" AND ")}`;
  }

  // 3. Retorna o resultado final AQUI
  return { filterSql, ...requirements };
}


/** Constrói as condições WHERE para busca genérica e identifica JOINs */
export function buildSearchCondition(
  searchTerm: string | undefined
): { searchSql: string } & JoinRequirements {
  const requirements: JoinRequirements = {
    needsFornece: false,
    needsTotal: false,
    needsVencimento: false,
    needsZ07: false,
  };
  let searchSql = "";
  const trimmedSearchTerm = searchTerm?.trim();

  if (trimmedSearchTerm) {
    const escapedSearchTerm = escapeSqlLike(trimmedSearchTerm);
    const likePattern = `LOWER('%${escapedSearchTerm}%')`;
    const conditions = searchColumns
      .map((col) => {
        // Verifica qual JOIN cada coluna da busca precisa
        if (col.startsWith("SA2.")) requirements.needsFornece = true;
        if (col.startsWith("SD1_TOTAL.")) requirements.needsTotal = true;
        // Adicionar checagem para Z10/Z07 se incluídos na busca
        // if (col.startsWith("Z10.")) requirements.needsVencimento = true;
        // if (col.startsWith("Z07.")) requirements.needsZ07 = true;
        return `LOWER(${col}) LIKE ${likePattern}`;
      })
      .join(" OR ");
    searchSql = ` AND (${conditions})`;
  }

  return { searchSql, ...requirements };
}

/** Constrói as cláusulas JOIN condicionais para as queries REC/COUNT */
export function buildConditionalJoins(requirements: JoinRequirements): string {
  const joins: string[] = [];
  if (requirements.needsFornece) {
    joins.push(
      `LEFT JOIN SA2010 SA2 WITH (NOLOCK) ON SA2.A2_COD = SF1.F1_FORNECE AND SA2.A2_LOJA = SF1.F1_LOJA AND SA2.D_E_L_E_T_ <> '*'`
    );
  }
  if (requirements.needsTotal) {
    joins.push(
      `LEFT JOIN ( SELECT D1_FILIAL, D1_DOC, D1_SERIE, D1_FORNECE, D1_LOJA, D1_TIPO, SUM(D1_TOTAL) AS F1_VALBRUT FROM SD1010 WITH (NOLOCK) WHERE D_E_L_E_T_ <> '*' GROUP BY D1_FILIAL, D1_DOC, D1_SERIE, D1_FORNECE, D1_LOJA, D1_TIPO ) SD1_TOTAL ON SD1_TOTAL.D1_FILIAL = SF1.F1_FILIAL AND SD1_TOTAL.D1_DOC = SF1.F1_DOC AND SD1_TOTAL.D1_SERIE = SF1.F1_SERIE AND SD1_TOTAL.D1_FORNECE = SF1.F1_FORNECE AND SD1_TOTAL.D1_LOJA = SF1.F1_LOJA AND SD1_TOTAL.D1_TIPO = SF1.F1_TIPO`
    );
  }
  if (requirements.needsVencimento) {
    joins.push(
      `LEFT JOIN Z10010 Z10 WITH (NOLOCK) ON Z10.Z10_TIPO = 'Titulos' AND Z10.Z10_CHAVE = (SF1.F1_FILIAL + SF1.F1_DOC + SF1.F1_SERIE + SF1.F1_FORNECE + SF1.F1_LOJA) AND Z10.D_E_L_E_T_ <> '*'`
    );
  }
  if (requirements.needsZ07) {
    joins.push(
      `LEFT JOIN Z07010 Z07 WITH (NOLOCK) ON Z07.Z07_CHAVE = (SF1.F1_FILIAL + SF1.F1_DOC + SF1.F1_SERIE + SF1.F1_FORNECE + SF1.F1_LOJA) AND Z07.D_E_L_E_T_ <> '*'`
    );
  }
  // Junta todas as cláusulas JOIN necessárias com espaço
  return joins.join("\n    ");
}

/** Constrói a parte SELECT da subquery para campos agregados/calculados necessários para ordenação */
export function buildSubquerySelectForSort(
  requirements: JoinRequirements
): string {
  const selects: string[] = [];
  // Usa subquery correlata (como antes) ou window functions se o DB suportar e for mais performático
  if (requirements.needsVencimento) {
    selects.push(
      `, (SELECT TOP 1 Z.Z10_VENCTO FROM Z10010 Z WITH (NOLOCK) WHERE Z.Z10_TIPO = 'Titulos' AND Z.Z10_CHAVE = (SF1.F1_FILIAL + SF1.F1_DOC + SF1.F1_SERIE + SF1.F1_FORNECE + SF1.F1_LOJA) AND Z.D_E_L_E_T_ <> '*' ORDER BY Z.Z10_VENCTO DESC) AS VENCIMENTO`
    );
  }
  if (requirements.needsZ07) {
    // Assume que MAX() OVER() não é ideal ou disponível, usa subquery correlata para pegar o último Z07 (pode precisar ajustar a lógica de 'último')
    selects.push(
      `, (SELECT TOP 1 Z.Z07_DESC FROM Z07010 Z WITH (NOLOCK) WHERE Z.Z07_CHAVE = (SF1.F1_FILIAL + SF1.F1_DOC + SF1.F1_SERIE + SF1.F1_FORNECE + SF1.F1_LOJA) AND Z.D_E_L_E_T_ <> '*' ORDER BY Z.R_E_C_N_O_ DESC) AS Z07_DESC`
    ); // Exemplo: pegar último pela RECNO
    selects.push(
      `, (SELECT TOP 1 Z.Z07_CHAVE FROM Z07010 Z WITH (NOLOCK) WHERE Z.Z07_CHAVE = (SF1.F1_FILIAL + SF1.F1_DOC + SF1.F1_SERIE + SF1.F1_FORNECE + SF1.F1_LOJA) AND Z.D_E_L_E_T_ <> '*' ORDER BY Z.R_E_C_N_O_ DESC) AS Z07_CHAVE`
    ); // Exemplo: pegar último pela RECNO
  }
  return selects.join("\n        ");
}
