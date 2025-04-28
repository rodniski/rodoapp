"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "utils"

/* ──────────────────────────────────────────────────────────
 * Tipagem: mantemos todas as props originais do Radix Label
 * e adicionamos um `required?: boolean`.
 * ──────────────────────────────────────────────────────────*/
export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  required?: boolean
}

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, required, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    data-slot="label"
    className={cn(
      "flex items-center gap-1 text-sm leading-none font-medium select-none",
      "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50",
      "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children}
    {required && (
      <span
        aria-hidden="true"          /* não lido por leitores de tela      */
        className="text-destructive"
      >
        *
      </span>
    )}
  </LabelPrimitive.Root>
))
Label.displayName = "Label"