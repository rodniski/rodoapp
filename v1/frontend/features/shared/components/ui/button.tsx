/**
 * @file button.tsx
 * @module UIButton
 * @description Componente de botão reutilizável e altamente personalizável com variantes e tamanhos.
 */

import * as React from "react"
import {Slot} from "@radix-ui/react-slot"
import {cva, type VariantProps} from "class-variance-authority"
import {cn} from "lib"

// Definição de variantes de botão (estilos e tamanhos)
const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                success: "bg-lime-500 text-primary-foreground hover:bg-lime/90",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8", 
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)


/**
 * @typedef ButtonProps
 * @description Propriedades aceitas pelo componente `Button`.
 * @property {boolean} [asChild=false] - Define se o componente será renderizado como `Slot`.
 * @property {string} [variant="default"] - Variante do botão (ex.: `default`, `destructive`, `outline`).
 * @property {string} [size="default"] - Tamanho do botão (ex.: `default`, `sm`, `lg`, `icon`).
 */
export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

/**
 * @function Button
 * @description Componente de botão reutilizável com suporte a variantes e tamanhos.
 * @param {ButtonProps} props - Propriedades do botão.
 * @returns {JSX.Element} Botão estilizado.
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({className, variant, size, asChild = false, ...props}, ref) => {
        const Comp = asChild ? Slot : "button" // Define o tipo do componente (botão ou slot)
        return (
            <Comp
                className={cn(buttonVariants({variant, size, className}))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export {Button, buttonVariants}



// a