/**
 * @file use-mobile.tsx
 * @module UseMobile
 * @description Hook personalizado para detectar se o dispositivo é móvel com base no breakpoint.
 */

import * as React from "react"

// Define o breakpoint para dispositivos móveis
const MOBILE_BREAKPOINT = 768

/**
 * @function useIsMobile
 * @description Hook para verificar se a largura da janela está abaixo do breakpoint definido (768px).
 * @returns {boolean} Retorna `true` se for um dispositivo móvel (abaixo de 768px), `false` caso contrário.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
