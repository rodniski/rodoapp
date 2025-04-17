// utils.ts

/** ─────────────────────────────────────────────────────────────
 * Utilitário para escapar valores SQL (previne injeções).
 * Aceita strings ou números e retorna uma versão segura.
 * Ex: "O'Hara" → 'O''Hara'
 */
export function escapeSQLValue(value: any): string {
  if (typeof value === "number") return value.toString();
  return `'${String(value).replace(/'/g, "''")}'`;
}

/** ─────────────────────────────────────────────────────────────
 * Converte todos os valores bigint de um array de objetos em number.
 * Prisma pode retornar bigints dependendo do banco utilizado.
 */
export function serializeBigInts(data: any[]): any[] {
  return data.map((item) =>
    Object.fromEntries(
      Object.entries(item).map(([key, value]) => [
        key,
        typeof value === "bigint" ? Number(value) : value,
      ])
    )
  );
}

/** ─────────────────────────────────────────────────────────────
 * Gera as cláusulas de filtro (WHERE) para a query SQL.
 * Os filtros são baseados em nome de colunas amigáveis da UI.
 */
export function buildFilterConditions(
  filters: Record<string, any> = {}
): string {
  const conditions: string[] = [];

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === "") continue;

    switch (key) {
      case "F1_XTIPO":
      case "F1_XPRIOR":
      case "F1_XUSRRA":
        conditions.push(`SF1.${key} = ${escapeSQLValue(value)}`);
        break;

      case "A2_NOME":
        conditions.push(`SA2.A2_NOME LIKE ${escapeSQLValue(`%${value}%`)}`);
        break;

      case "F1_VALBRUT_MIN":
        conditions.push(`SD1_TOTAL.TOTAL >= ${escapeSQLValue(value)}`);
        break;

      case "F1_VALBRUT_MAX":
        conditions.push(`SD1_TOTAL.TOTAL <= ${escapeSQLValue(value)}`);
        break;

      default:
        // Evitar campos desconhecidos
        break;
    }
  }

  return conditions.length ? `AND ${conditions.join(" AND ")}` : "";
}

/** ─────────────────────────────────────────────────────────────
 * Gera cláusula ORDER BY segura usando aliasMap para traduzir nomes amigáveis.
 * Ex: [{ id: "FORNECE", desc: true }] → "SA2.A2_NOME DESC"
 */
export function buildSortingClause(
  sorting: { id: string; desc: boolean }[] = [],
  context: "subquery" | "main" = "main"
): string {
  const clause = sorting
    .map(({ id, desc }) => {
      const column = aliasMap[id] || id;

      if (context === "subquery" && !sortableColumnsInSubquery.has(id)) {
        return null; // Ignora o campo na subquery
      }

      return `${column} ${desc ? "DESC" : "ASC"}`;
    })
    .filter(Boolean)
    .join(", ");

  return clause || "SF1.R_E_C_N_O_ DESC"; // fallback
}

/** ─────────────────────────────────────────────────────────────
 * Mapeia os campos visuais da UI para os campos reais do SQL.
 * Isso permite que os filtros e ordenações sejam seguros e compatíveis.
 */
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
  F1_EMISSAO: "SF1.F1_EMISSAO",
  F1_DTDIGIT: "SF1.F1_DTDIGIT",
  F1_VALBRUT: "SD1_TOTAL.F1_VALBRUT",
  VENCIMENTO: "VENCIMENTO",
  Z07_DESC: "Z07.Z07_DESC",
  Z07_CHAVE: "Z07.Z07_CHAVE",
  F1_XTIPO: "SF1.F1_XTIPO",
  F1_XPRIOR: "SF1.F1_XPRIOR",
  F1_XORI: "SF1.F1_XORI",
  F1_XUSRRA: "SF1.F1_XUSRRA",
  F1_XOBS: "SF1.F1_XOBS",
  F1_ZOBSREV: "SF1.F1_ZOBSREV",
  F1_XREV: "SF1.F1_XREV",
};

// Campos que são ordenáveis na subquery (colunas reais)
export const sortableColumnsInSubquery = new Set([
  "REC",
  "F1_FILIAL",
  "F1_DOC",
  "F1_SERIE",
  "F1_STATUS",
  "A2_COD",
  "A2_LOJA",
  "A2_NOME",
  "F1_EMISSAO",
  "F1_DTDIGIT",
  "F1_VALBRUT",
  "F1_XTIPO",
  "F1_XPRIOR",
  "F1_XORI",
  "F1_XUSRRA",
  "F1_XREV",
]);
