export function escapeSqlLike(value: string | undefined | null): string {
  if (!value) return '';
  return value.replace(/'/g, "''");
}

export function serializeBigInts(data: any[]): any[] {
  if (!Array.isArray(data)) return data;
  return data.map((item) => {
    if (item === null || typeof item !== 'object') return item;
    return Object.fromEntries(
      Object.entries(item).map(([key, value]) => [
        key,
        typeof value === "bigint" ? Number(value) : value,
      ])
    );
  });
}

export const aliasMap: Record<string, string> = {
  REC: "SF1.R_E_C_N_O_",
  F4_TRANFIL: "SF4.F4_TRANFIL",
  F1_FILIAL: "SF1.F1_FILIAL",
  F1_DOC: "SF1.F1_DOC",
  F1_SERIE: "SF1.F1_SERIE",
  F1_STATUS: "SF1.F1_STATUS",
  A2_COD: "SA2.A2_COD",
  A2_LOJA: "SA2.A2_LOJA",
  A2_NOME: "SA2.A2_NOME",
  FORNECE: "(SA2.A2_COD + ' ' + SA2.A2_LOJA + ' - ' + SA2.A2_NOME)",
  F1_EMISSAO: "SF1.F1_EMISSAO",
  F1_DTDIGIT: "SF1.F1_DTDIGIT",
  F1_VALBRUT: "SD1_TOTAL.F1_VALBRUT",
  VENCIMENTO: "VENCIMENTO",
  F1_XTIPO: "SF1.F1_XTIPO",
  F1_XPRIOR: "SF1.F1_XPRIOR",
  F1_XORI: "SF1.F1_XORI",
  F1_XUSRRA: "SF1.F1_XUSRRA",
  F1_XOBS: "SF1.F1_XOBS",
  F1_ZOBSREV: "SF1.F1_ZOBSREV",
  F1_XREV: "SF1.F1_XREV",
  USUARIO: "''",
  Z07_DESC: "Z07.Z07_DESC",
  Z07_CHAVE: "Z07.Z07_CHAVE",
};

export const sortableColumnsInSubquery = new Set([
  "REC",
  "F1_FILIAL",
  "F1_DOC",
  "F1_SERIE",
  "F1_STATUS",
  "F1_EMISSAO",
  "F1_DTDIGIT",
  "F1_XTIPO",
  "F1_XPRIOR",
  "F1_XORI",
  "F1_XUSRRA",
  "F1_XREV",
  "A2_COD",
  "A2_LOJA",
  "A2_NOME",
  "F1_VALBRUT",
  "VENCIMENTO",
]);

const DEFAULT_SORT_SUBQUERY = "SF1.R_E_C_N_O_ DESC";

export function buildSortingClause(
  sorting: { id: string; desc: boolean }[] = [],
  context: "subquery" | "main" = "main"
): string {
  const validSorts = sorting
    .map(({ id, desc }) => {
      const sqlColumn = aliasMap[id];
      if (!sqlColumn) {
        console.warn(`buildSortingClause: ID de ordenação desconhecido "${id}" ignorado.`);
        return null;
      }
      if (context === "subquery" && !sortableColumnsInSubquery.has(id)) {
        console.warn(`buildSortingClause: Ordenação por "${id}" ignorada no contexto da subquery.`);
        return null;
      }
      return `${sqlColumn} ${desc ? "DESC" : "ASC"}`;
    })
    .filter((clause): clause is string => clause !== null);
  return validSorts.length > 0 ? validSorts.join(", ") : DEFAULT_SORT_SUBQUERY;
}

export function buildFilterConditions(filters: Partial<Record<keyof PrenotaRow, string | number>> = {}): {
  filterSql: string;
  requiresForneceJoin: boolean;
  requiresTotalJoin: boolean;
  requiresVencimentoSelect: boolean;
  requiresZ07Join: boolean;
} {
  if (!filters || Object.keys(filters).length === 0) {
    return {
      filterSql: "",
      requiresForneceJoin: false,
      requiresTotalJoin: false,
      requiresVencimentoSelect: false,
      requiresZ07Join: false,
    };
  }

  const conditions: string[] = [];
  let requiresForneceJoin = false;
  let requiresTotalJoin = false;
  let requiresVencimentoSelect = false;
  let requiresZ07Join = false;

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null) {
      console.warn(`buildFilterConditions: Valor inválido para filtro "${key}" ignorado.`);
      continue;
    }
    const sqlColumn = aliasMap[key];
    if (!sqlColumn) {
      console.warn(`buildFilterConditions: Coluna desconhecida "${key}" ignorada.`);
      continue;
    }
    if (sqlColumn.startsWith("SA2.") || key === "FORNECE") {
      requiresForneceJoin = true;
    } else if (sqlColumn.includes("SD1_TOTAL")) {
      requiresTotalJoin = true;
    } else if (key === "VENCIMENTO") {
      requiresVencimentoSelect = true;
    } else if (sqlColumn.startsWith("Z07.")) {
      requiresZ07Join = true;
    }
    if (typeof value === "string") {
      const escapedValue = escapeSqlLike(value);
      conditions.push(`${sqlColumn} = '${escapedValue}'`);
    } else if (typeof value === "number") {
      conditions.push(`${sqlColumn} = ${value}`);
    }
  }

  const filterSql = conditions.length > 0 ? ` AND (${conditions.join(" AND ")})` : "";
  return {
    filterSql,
    requiresForneceJoin,
    requiresTotalJoin,
    requiresVencimentoSelect,
    requiresZ07Join,
  };
}