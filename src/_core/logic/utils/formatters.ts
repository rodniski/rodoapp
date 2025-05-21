// src/utils/formatters.ts (ou _core/utils/formatters.ts)
/**
 * @file Utilitários de Formatação e Parsing
 * @description Contém funções para formatar e parsear datas, números,
 * moedas, documentos (CNPJ) e strings comuns na aplicação.
 */

import { format, isValid, parse, differenceInDays, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

// --------------------------------------------------------------------------
// Tipos Comuns
// --------------------------------------------------------------------------

/** Tipo para string de data no formato brasileiro "dd/MM/yyyy" */
export type BRDateString = `${number}/${number}/${number}`;

// --------------------------------------------------------------------------
// Formatadores / Parsers de Data e Hora
// --------------------------------------------------------------------------

/**
 * Converte string "dd/MM/yyyy" ou com hora ("dd/MM/yyyy HH:mm...") para objeto `Date`.
 * Ignora a parte da hora e considera apenas a data.
 * Retorna `undefined` se a string for nula, vazia ou inválida.
 *
 * @param dateStr String da data no formato brasileiro.
 * @returns Um objeto `Date` ou `undefined`.
 */
export function parseDateBR(
  dateStr: string | null | undefined
): Date | undefined {
  if (!dateStr?.trim()) return undefined;
  const dateOnly = dateStr.split(" ")[0]; // Pega apenas a parte da data
  // Usa new Date() como referência para o parse, date-fns lida com o formato
  const parsed = parse(dateOnly, "dd/MM/yyyy", new Date());
  // Valida se o parse resultou em uma data válida
  return isValid(parsed) ? parsed : undefined;
}

/**
 * Converte string "yyyyMMdd" para objeto `Date`.
 * Retorna `undefined` se a string for nula, vazia ou inválida.
 * Utiliza UTC para evitar problemas de fuso horário na criação da data.
 *
 * @param dateStr String da data no formato "yyyyMMdd".
 * @returns Um objeto `Date` (representando meia-noite UTC daquele dia) ou `undefined`.
 */
export function parseDateYYYYMMDD(
  dateStr: string | null | undefined
): Date | undefined {
  const trimmedStr = dateStr?.trim();
  // Validação básica do formato
  if (!trimmedStr || !/^\d{8}$/.test(trimmedStr)) {
    return undefined;
  }
  const year = parseInt(trimmedStr.substring(0, 4), 10);
  const month = parseInt(trimmedStr.substring(4, 6), 10) - 1; // Mês é 0-indexado
  const day = parseInt(trimmedStr.substring(6, 8), 10);

  // Cria a data em UTC para garantir consistência
  const date = new Date(Date.UTC(year, month, day));

  // Validação extra para garantir que os componentes formam uma data real
  // (ex: evita criar 31/02 que viraria 03/03)
  if (
    isNaN(date.getTime()) ||
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month ||
    date.getUTCDate() !== day
  ) {
    return undefined; // Data inválida (ex: 31 de Fev)
  }
  return date; // Retorna o objeto Date válido
}

/**
 * Formata um objeto `Date` para string "dd/MM/yyyy".
 * Retorna string vazia se a data for nula ou inválida.
 *
 * @param date Objeto Date a ser formatado.
 * @returns A data formatada como `BRDateString` ou "".
 */
export function formatDateBR(date: Date | null | undefined): BRDateString | "" {
  if (!date || !isValid(date)) return "";
  try {
    // Formata usando date-fns com locale pt-BR
    return format(date, "dd/MM/yyyy", { locale: ptBR }) as BRDateString;
  } catch (error) {
    toast.error("Erro ao formatar data para BR:", error || "");
    return ""; // Retorna vazio em caso de erro inesperado
  }
}

/**
 * Formata uma string de data no formato "yyyyMMdd" para "dd/MM/yyyy" para exibição em células de tabela.
 * Retorna "-" se a entrada for inválida.
 *
 * @param dateString String da data no formato "yyyyMMdd".
 * @returns A data formatada como "dd/MM/yyyy" ou "-".
 */
export const formatDateForCell = (
  dateString: string | undefined | null
): string => {
  const parsedDate = parseDateYYYYMMDD(dateString); // Reusa o parser robusto
  if (!parsedDate) return "-"; // Retorna '-' se o parse falhar
  return formatDateBR(parsedDate) || "-"; // Reusa o formatador BR, com fallback '-'
};

/**
 * Normaliza uma string que pode conter data e hora (ex: "dd/MM/yyyy HH:mm:ss")
 * para conter apenas a data no formato "dd/MM/yyyy".
 * Retorna string vazia se a entrada for inválida.
 *
 * @param datetime String de data/hora.
 * @returns A data normalizada como `BRDateString` ou "".
 */
export function normalizeDateString(
  datetime: string | null | undefined
): BRDateString | "" {
  const parsed = parseDateBR(datetime); // Utiliza parseDateBR que já ignora a hora
  return formatDateBR(parsed); // Formata de volta para string BR
}

/**
 * Converte strings de data e hora do Protheus para objetos Date válidos.
 */
export function parseProtheusDate(
  dateStr: string | null,
  timeStr?: string | null
): Date | null {
  if (!dateStr) return null;

  // dd/MM/yyyy HH:mm:ss
  if (dateStr.includes("/")) {
    return parseDateBR(`${dateStr} ${timeStr || "00:00:00"}`) || null;
  }

  // yyyyMMdd HHmmss
  if (/^\d{8}$/.test(dateStr)) {
    const date = parseDateYYYYMMDD(dateStr);
    if (date && timeStr && /^\d{6}$/.test(timeStr)) {
      const hours = +timeStr.substring(0, 2);
      const minutes = +timeStr.substring(2, 4);
      const seconds = +timeStr.substring(4, 6);
      date.setHours(hours, minutes, seconds);
    }
    return date || null;
  }

  return null;
}

/**
 * Calcula a diferença em dias entre duas datas.
 * Retorna a diferença como número (positivo se dataFim for futura, negativo se passada).
 * Retorna 0 se as datas forem inválidas ou iguais.
 * Zera a hora das datas para comparar apenas os dias.
 *
 * @param dateFim Data final da comparação.
 * @param dateIni Data inicial da comparação (padrão: hoje).
 * @returns Número de dias de diferença.
 */
export function differenceInCalendarDays(
  dateFim: Date | null | undefined,
  dateIni: Date | null | undefined = new Date() // Default é hoje
): number {
  if (!dateFim || !isValid(dateFim) || !dateIni || !isValid(dateIni)) {
    return 0;
  }
  // Usa startOfDay para zerar horas/minutos/segundos no fuso horário local
  const fimDoDia = startOfDay(dateFim);
  const inicioDoDia = startOfDay(dateIni);
  return differenceInDays(fimDoDia, inicioDoDia);
}

// --------------------------------------------------------------------------
// Formatadores / Parsers de Números e Moeda
// --------------------------------------------------------------------------

/**
 * Formata um valor numérico para moeda brasileira (BRL - R$).
 * Trata null/undefined como 0.
 *
 * @param value Valor numérico a ser formatado.
 * @param minimumFractionDigits Mínimo de casas decimais (padrão 2).
 * @returns String formatada como moeda (ex: "R$ 1.234,56").
 */
export function formatCurrency(
  value: number | null | undefined,
  minimumFractionDigits = 2
): string {
  const numValue = value ?? 0; // Converte null/undefined para 0
  return numValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: minimumFractionDigits,
  });
}

/**
 * Formata um número como percentual com casas decimais e símbolo '%'.
 * Trata null/undefined como 0.
 *
 * @param value Valor numérico (ex: 95.5 para 95.50%).
 * @param decimals Número de casas decimais (padrão 2).
 * @returns String formatada como percentual (ex: "95.50%").
 */
export function formatPercentage(
  value: number | null | undefined,
  decimals = 2
): string {
  const numValue = value ?? 0;
  // Usa toFixed para garantir as casas decimais e adiciona o símbolo %
  return `${numValue.toFixed(decimals)}%`;
}

/**
 * Converte um valor (string ou número) para número float.
 * Remove formatação de moeda e trata vírgula como decimal.
 * Retorna 0 se a conversão falhar ou o valor for inválido/vazio/nulo.
 * Ideal para valores que podem vir como string formatada ou número direto.
 *
 * @param value Valor a ser convertido (string ou número).
 * @returns O número float correspondente ou 0.
 */
export function parseFloatOrZero(value?: string | number | null): number {
  if (typeof value === "number") {
    return isNaN(value) ? 0 : value; // Retorna 0 se for NaN
  }
  if (typeof value === "string" && value.trim() !== "") {
    // Remove R$, espaços e pontos (milhar)
    const cleaned = value.replace(/R?\$\s?/g, "").replace(/\./g, "");
    // Troca vírgula (decimal BR) por ponto
    const normalized = cleaned.replace(",", ".");
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  }
  // Retorna 0 para null, undefined, string vazia ou outros tipos
  return 0;
}

/**
 * Converte um valor (string ou número) para número float.
 * Remove formatação de moeda e trata vírgula como decimal.
 * Retorna `null` se a conversão falhar ou o valor for inválido/vazio/nulo.
 * Útil quando a distinção entre 0 e valor inválido/ausente é importante.
 *
 * @param value Valor a ser convertido (string, número, null ou undefined).
 * @returns O número float correspondente ou `null`.
 */
export function parseFloatOrNull(
  value: string | number | null | undefined
): number | null {
  if (typeof value === "number") {
    return isNaN(value) ? null : value; // Retorna null se for NaN
  }
  if (typeof value === "string" && value.trim() !== "") {
    const cleaned = value.replace(/R?\$\s?/g, "").replace(/\./g, "");
    const normalized = cleaned.replace(",", ".");
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? null : parsed; // Retorna null se falhar o parse
  }
  // Retorna null para null, undefined, string vazia ou outros tipos
  return null;
}

/**
 * Tenta converter uma string de input (potencialmente mal formatada,
 * com R$, separadores de milhar variados) para um número float.
 * Prioriza vírgula como decimal se ambos os separadores existirem.
 * Retorna 0 se a conversão falhar.
 *
 * @param value A string do input.
 * @returns O número float correspondente ou 0.
 */
export function parseInputToNumber(value: string | null | undefined): number {
  if (!value) return 0;

  // Remove R$, espaços. Deixa dígitos, ponto, vírgula e sinal de menos inicial.
  let cleaned = String(value)
    .trim()
    .replace(/R?\$\s?/g, "");
  // Remove pontos de milhar (exceto se for o único separador e estiver no final)
  // Remove vírgulas de milhar (exceto se for o único separador e estiver no final)

  const hasComma = cleaned.includes(",");
  const hasPeriod = cleaned.includes(".");

  // Se tem vírgula, trata como decimal BR: remove pontos, troca vírgula
  if (hasComma) {
    cleaned = cleaned.replace(/\./g, "").replace(",", ".");
  }
  // Se não tem vírgula, mas tem ponto, trata como decimal US: remove vírgulas
  else if (hasPeriod) {
    cleaned = cleaned.replace(/,/g, "");
  }
  // Se não tem nenhum, ou só tem um tipo de separador,
  // a tentativa de parseFloat geralmente funciona.

  // Remove caracteres não numéricos restantes, exceto o ponto decimal e o sinal negativo inicial
  cleaned = cleaned.replace(/[^\d.-]/g, "");

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// --------------------------------------------------------------------------
// Formatadores de Documentos
// --------------------------------------------------------------------------

/**
 * Formata um CNPJ (string de 14 dígitos) para o padrão 00.000.000/0000-00.
 * Retorna a string original se a entrada for inválida em tamanho após limpeza.
 *
 * @param cnpj String contendo o CNPJ (pode ter máscara ou não).
 * @returns CNPJ formatado ou string original/vazia.
 */
export function formatCNPJ(cnpj: string | null | undefined): string {
  if (!cnpj) return "";
  const cleaned = cnpj.replace(/\D/g, ""); // Remove tudo que não for dígito
  if (cleaned.length !== 14) {
    // Não formata se não tiver exatamente 14 dígitos
    return cnpj; // Retorna o valor original (pode ser útil para indicar erro)
  }
  // Aplica a máscara
  return cleaned.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

// --------------------------------------------------------------------------
// Formatadores / Utilitários de String
// --------------------------------------------------------------------------

/**
 * Obtém as iniciais (máximo 2) de um nome (separado por espaço ou ponto).
 * Retorna "?" se a entrada for inválida.
 *
 * @param name String com o nome completo ou username.
 * @returns As duas primeiras iniciais em maiúsculo ou "?".
 */
export function getInitials(name: string | null | undefined): string {
  if (!name?.trim()) return "?";
  // Divide por ponto ou espaço, pega a primeira letra de cada parte,
  // limita a 2 iniciais e junta em maiúsculo.
  return name
    .trim()
    .split(/[.\s]+/) // Divide por ponto ou espaço
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Formata um nome de usuário (geralmente user.name) para capitalizado.
 * Ex: "fulano.silva" -> "Fulano Silva". Retorna string vazia se inválido.
 *
 * @param username Username no formato "parte1.parte2...".
 * @returns Nome formatado ou string vazia.
 */
export function formatUsername(username: string | null | undefined): string {
  if (!username?.trim()) return "";
  return username
    .trim()
    .split(".") // Assume separador ponto
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) // Capitaliza cada parte
    .join(" "); // Junta com espaço
}

/**
 * Remove todos os caracteres não numéricos de uma string.
 * Retorna string vazia se a entrada for nula ou vazia.
 *
 * @param value String a ser limpa.
 * @returns String contendo apenas números ou string vazia.
 */
export function numbersOnly(value: string | null | undefined): string {
  if (!value) return "";
  return value.replace(/\D/g, ""); // Remove tudo que não for dígito
}

// --------------------------------------------------------------------------
// Parsers Específicos (Exemplo - pode não ser necessário com os float*)
// --------------------------------------------------------------------------

/**
 * Converte um valor formatado como moeda ("R$ 1.234,56") para número.
 * **OBS:** Prefira `parseFloatOrZero` ou `parseInputToNumber` que são mais genéricos.
 * Retorna 0 se inválido.
 *
 * @param value Valor em string formatado como moeda.
 * @returns Número float ou 0.
 * @deprecated Use parseFloatOrZero ou parseInputToNumber para maior flexibilidade.
 */
export function parseCurrencyToNumber(
  value: string | null | undefined
): number {
  console.warn(
    "parseCurrencyToNumber está depreciada, use parseFloatOrZero ou parseInputToNumber."
  );
  if (!value) return 0;
  // Lógica similar a parseFloatOrZero
  const cleanedValue = value
    .replace(/R?\$\s?/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const num = parseFloat(cleanedValue);
  return isNaN(num) ? 0 : num;
}


/**
 * Extrai campos dos logs de erro do Protheus.
 * Exemplo de string:
 *  "ERRO  AJUDAEXISTNF ... - cSerie 1  - cNFiscal 85867 - dDEmissao 11042025
 *   - cA100For 080980 - cLoja 01 ..."
 */
export function parseProtheusError(raw: string) {
  const clean = raw.replace(/\s+/g, " ");
  const pairs = [...clean.matchAll(/-\s(\w+)\s+([^\s]+)/g)];

  const map = Object.fromEntries(pairs.map(([, k, v]) => [k, v]));

  const date =
    map.dDEmissao?.replace(/(\d{2})(\d{2})(\d{4})/, (_, d, m, y) =>
      `${d}/${m}/${y}`,
    ) ?? "";

  return {
    code: clean.match(/AJUDA\w+/)?.[0] ?? "",
    nf: map.cNFiscal,
    serie: map.cSerie,
    fornecedor: map.cA100For,
    loja: map.cLoja,
    emissao: date,
  };
}
