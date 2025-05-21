// src/utils/hooks.ts (ou _core/utils/hooks.ts)
import { useState, useEffect } from "react";

/**
 * Hook personalizado para debounce de valores.
 * Útil para atrasar buscas em campos de input, por exemplo.
 * @param value O valor a ser debounced.
 * @param delay Tempo de atraso em ms (default 300).
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => { setDebouncedValue(value); }, delay);
    return () => { clearTimeout(handler); };
  }, [value, delay]);
  return debouncedValue;
}