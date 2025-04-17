"use client"

import * as React from "react"
import {Check, ChevronsUpDown} from "lucide-react"
import {cn} from "lib"
import {
    Button,
    type ComboboxItem,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    Popover,
    PopoverContent,
    PopoverTrigger,
    ScrollArea,
} from "ui"
import {toast} from "sonner"
import type {Produto} from "#/incluir/interfaces"

interface MultiComboboxProps {
    items: ComboboxItem[]
    placeholder?: string
    onSelect: (values: string[]) => void
    selectedValues?: string[]
    renderSelected?: (item: ComboboxItem) => string
    disabled?: boolean
    width?: string | number
    disabledReason?: string
    pedidos?: Produto[]
    // Props para tratamento de erro
    error?: boolean
    errorMessage?: string
    onClearError?: () => void
}

export function ComboboxMultiplo({
                                     items,
                                     placeholder = "Selecione...",
                                     onSelect,
                                     selectedValues = [],
                                     renderSelected,
                                     disabled = false,
                                     width = "100%",
                                     disabledReason,
                                     pedidos,
                                     error = false,
                                     errorMessage,
                                     onClearError,
                                 }: MultiComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const [hoveredItem, setHoveredItem] = React.useState<string | null>(null)
    const triggerRef = React.useRef<HTMLButtonElement | null>(null)
    const [showPing, setShowPing] = React.useState(false)

    const isDisabled = items.length === 0 || disabled;

    // Efeito para mostrar o ping quando houver erro
    React.useEffect(() => {
        if (error) {
            setShowPing(true)
        } else {
            setShowPing(false)
        }
    }, [error])

    const toggleItem = (value: string) => {
        const newValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value]
        onSelect(newValues)

        // Se selecionou algum valor e existe a função para limpar erro, chama ela
        if (newValues.length > 0 && onClearError) {
            onClearError()
        }
    }

    const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (disabled && disabledReason) {
            event.preventDefault()
            event.stopPropagation()
            toast({
                title: "Erro",
                description: disabledReason,
                variant: "destructive",
            })
        } else {
            setOpen(!open)
        }
    }

    const renderButtonContent = () => {
        if (selectedValues.length === 0) {
            return <span className="truncate">{placeholder}</span>
        }

        const selectedLabels = selectedValues
            .map((value) => {
                const item = items.find((i) => i.value === value)
                return item ? (renderSelected ? renderSelected(item) : item.label) : null
            })
            .filter(Boolean)
            .join(", ")

        return <span className="truncate">{selectedLabels}</span>
    }

    const renderTooltipContent = (pedidoNumero: string) => {
        const pedido = pedidos?.find((p) => p.numero === pedidoNumero)
        if (!pedido) return null

        return (
            <div className="p-2 w-96">
                <span className="font-semibold text-sm mb-2">Produtos do Pedido {pedidoNumero}:</span>
                <ul className="text-xs font-semibold">
                    {pedido.map((produto, index) => (
                        <li key={index} className="mb-1">
                            {produto.codigo} - {produto.descricao} - Qtd: {produto.quantidade}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <div className="relative w-full">
            <Popover open={open && !disabled} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={triggerRef}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between truncate",
                            isDisabled && "text-muted-foreground",
                            error && "border-red-500",
                        )}
                        style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: width,
                        }}
                        onClick={handleButtonClick}
                        disabled={isDisabled}
                    >
                        {renderButtonContent()}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                    </Button>
                </PopoverTrigger>
                {!disabled && (
                    <PopoverContent
                        style={{width: triggerRef.current?.offsetWidth || "auto"}}
                        className="w-full p-0"
                        align="start"
                    >
                        <Command>
                            <CommandInput placeholder={`Buscar ${placeholder}...`}/>
                            <CommandList>
                                <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                                <ScrollArea>
                                    <CommandGroup>
                                        {items.map((item) => (
                                            <CommandItem
                                                key={item.value}
                                                value={item.value}
                                                onSelect={() => toggleItem(item.value)}
                                                onMouseEnter={() => setHoveredItem(item.value)}
                                                onMouseLeave={() => setHoveredItem(null)}
                                                className="relative"
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedValues.includes(item.value) ? "opacity-100" : "opacity-0",
                                                    )}
                                                />
                                                <span className="truncate">{item.label}</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </ScrollArea>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                )}
            </Popover>

            {/* Indicador de erro com animate-ping */}
            {showPing && (
                <div className="absolute -top-1 -right-1 z-10">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
                </div>
            )}

            {/* Mensagem de erro */}
            {error && errorMessage && <p className="text-sm font-medium text-red-500 mt-1">{errorMessage}</p>}

            {hoveredItem && (
                <div
                    className="absolute left-[calc(100%+10px)] top-0 z-50 bg-card/10 backdrop-blur-xl text-popover-foreground shadow-xl border border-muted rounded-md">
                    {renderTooltipContent(hoveredItem)}
                </div>
            )}
        </div>
    )
}

