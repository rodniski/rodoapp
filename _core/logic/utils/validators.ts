// src/utils/validators.ts (ou _core/utils/validators.ts)

/**
 * Valida o formato de uma chave de NFe (44 dígitos numéricos).
 * @param chave A string da chave a ser validada.
 * @returns true se a chave tiver o formato válido, false caso contrário.
 */
export function isValidChaveNFe(chave: string | null | undefined): boolean {
    if (!chave) return false;
    const cleaned = chave.replace(/\D/g, ""); // Remove não dígitos
    return cleaned.length === 44;
}

/**
 * Valida um CNPJ (verifica formatação e dígitos verificadores).
 * Fonte: https://github.com/ContaAzul/validations/blob/master/src/cnpj.js (Adaptado)
 * @param cnpj String com o CNPJ (pode conter máscara).
 * @returns true se válido, false caso contrário.
 */
export function isValidCNPJ(cnpj: string | null | undefined): boolean {
  if (!cnpj) return false;
  const cleaned = cnpj.replace(/[^\d]+/g, '');
  if (cleaned.length !== 14 || /^(\d)\1+$/.test(cleaned)) return false; // Verifica tamanho e se todos são iguais

  let size = cleaned.length - 2;
  let numbers = cleaned.substring(0, size);
  const digits = cleaned.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0), 10)) return false;

  size = size + 1;
  numbers = cleaned.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i), 10) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return result === parseInt(digits.charAt(1), 10);
}

export function isValidDate(d: any): d is Date {
  return d instanceof Date && !isNaN(d.getTime());
}
// Se uma propriedade for um objeto (não array e não null), chama recursivamente.
export const trimStringProperties = <T extends object>(obj: T): T => {
  if (!obj) return obj; // Retorna o objeto original se for null ou undefined

  // Se for um array, mapeia cada elemento e aplica a função recursivamente
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      typeof item === "object" && item !== null
        ? trimStringProperties(item)
        : typeof item === "string"
        ? item.trim()
        : item
    ) as unknown as T;
  }

  const newObj = { ...obj }; // Cria uma cópia superficial para não modificar o original diretamente
  for (const key in newObj) {
    if (Object.prototype.hasOwnProperty.call(newObj, key)) {
      const value = newObj[key];
      if (typeof value === "string") {
        (newObj as any)[key] = value.trim();
      } else if (typeof value === "object" && value !== null) {
        // Chama recursivamente para objetos aninhados (incluindo arrays dentro de objetos)
        (newObj as any)[key] = trimStringProperties(value as unknown as object);
      }
    }
  }
  return newObj;
};