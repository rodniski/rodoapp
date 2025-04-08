/**
 * @file separator.tsx
 * @module Separator
 * @description Componente para exibir separadores horizontais ou verticais, utilizando Radix UI.
 */

"use client"
import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "lib"


/**
 * @component Separator
 * @description Componente para exibir uma linha de separação estilizada.
 * @param {React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>} props - Propriedades do separador.
 * @param {string} [props.className] - Classes CSS adicionais.
 * @param {"horizontal" | "vertical"} [props.orientation="horizontal"] - Orientação do separador.
 * @param {boolean} [props.decorative=true] - Indica se o separador é decorativo (não semântico).
 * @param {React.Ref} ref - Referência ao elemento raiz do separador.
 * @returns {JSX.Element} Linha de separação estilizada.
 */
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

export { Separator }
