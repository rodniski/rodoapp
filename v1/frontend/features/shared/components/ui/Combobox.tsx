"use client"

import * as React from "react"
import {Check, ChevronsUpDown} from 'lucide-react'
import {cn} from "lib"
import {
    Button,
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

// Tipagem para os itens do Combobox
export interface ComboboxItem {
    value: string
    label: string
}

// Propriedades aceitas pelo Combobox
interface ComboboxProps {

    items: ComboboxItem[]
    placeholder?: string
    onSelect: (value: string | null) => void
    selectedValue?: string | null
    renderSelected?: (item: ComboboxItem) => React.ReactNode
    disabled?: boolean
    disabledReason?: string
    itemRender?: (item: any) => React.ReactNode
    // Props para tratamento de erro
    error?: boolean
    errorMessage?: string
    onClearError?: () => void
}

export function Combobox({
                             items,
                             placeholder = "Selecione um item...",
                             onSelect,
                             selectedValue,
                             renderSelected,
                             disabled = false,
                             disabledReason,
                             itemRender,
                             // Props de erro
                             error = false,
                             errorMessage,
                             onClearError,
                         }: ComboboxProps) {
    const [open, setOpen] = React.useState(false)
    const triggerRef = React.useRef<HTMLButtonElement | null>(null)
    const [showPing, setShowPing] = React.useState(false)

    // Efeito para mostrar o ping quando houver erro
    React.useEffect(() => {
        if (error) {
            setShowPing(true)
        } else {
            setShowPing(false)
        }
    }, [error])

    const selectedItem = items.find((item) => item.value === selectedValue)

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
            setOpen((prevOpen) => !prevOpen)
        }
    }

    return (
        <div className="relative w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={triggerRef}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn(
                            "w-full justify-between truncate",
                            disabled && "text-muted-foreground",
                            error && "border-red-500"
                        )}
                        style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                        onClick={handleButtonClick}
                    >
            <span className="truncate">
              {selectedItem
                  ? renderSelected
                      ? renderSelected(selectedItem)
                      : selectedItem.label
                  : placeholder}
            </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    style={{
                        width: triggerRef.current?.offsetWidth || "auto",
                    }}
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
                                            value={item.label}
                                            onSelect={(currentValue) => {
                                                onSelect(currentValue === selectedValue ? null : item.value)
                                                // Limpa o erro quando seleciona um valor
                                                if (onClearError && currentValue !== selectedValue) {
                                                    onClearError()
                                                }
                                                setOpen(false)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    selectedValue === item.value ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {itemRender ? (
                                                itemRender(item)
                                            ) : (
                                                <span className="truncate">{item.label}</span>
                                            )}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </ScrollArea>
                        </CommandList>
                    </Command>
                </PopoverContent>
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
        </div>
    )
}
