/**
 * @file card.tsx
 * @module UICard
 * @description Conjunto de componentes para renderizar cartões reutilizáveis.
 */

import * as React from "react"
import { cn } from "lib"

/**
 * @function Card
 * @description Componente base para renderizar um cartão com estilos padrão.
 * @returns {JSX.Element} Cartão estilizado.
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"


/**
 * @function CardHeader
 * @description Componente para renderizar o cabeçalho do cartão.
 * @returns {JSX.Element} Cabeçalho estilizado.
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"


/**
 * @function CardTitle
 * @description Componente para renderizar o título do cartão.
 * @returns {JSX.Element} Título estilizado.
 */
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"


/**
 * @function CardDescription
 * @description Componente para renderizar a descrição do cartão.
 * @returns {JSX.Element} Descrição estilizada.
 */
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/**
 * @function CardContent
 * @description Componente para renderizar o conteúdo do cartão.
 * @returns {JSX.Element} Conteúdo estilizado.
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

/**
 * @function CardFooter
 * @description Componente para renderizar o rodapé do cartão.
 * @returns {JSX.Element} Rodapé estilizado.
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
