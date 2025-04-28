// hooks/usePrenotaProgress.ts
import { useMemo } from "react"
import { get } from "lodash-es"          // para ler por “caminho”.
import { usePreNotaStore } from "@inclusao/stores"
import { requiredAll }   from "@inclusao/validation/required-fields"

export function usePrenotaProgress() {
  const draft = usePreNotaStore(s => s.draft)

  return useMemo(() => {
    let filled = 0

    requiredAll.forEach(path => {
      const value = get(draft, path as string)
      // regra simples: se for array - precisa length>0
      // se for string/number/bool - precisa value truthy
      if (Array.isArray(value) ? value.length > 0 : !!value) {
        filled++
      }
    })

    const total = requiredAll.length
    const percent = Math.round((filled / total) * 100)

    return { filled, total, percent }
  }, [draft])
}
