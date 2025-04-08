"use client"

import * as React from "react"
import { useAtom } from "jotai"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronsUpDown, Save } from "lucide-react"
import { Button, Popover, PopoverContent, PopoverTrigger, Textarea } from "ui"
import { justificativaAtom, prioridadeAtom } from "#/incluir/atoms"

export const PRIORIDADE_OPTIONS = [
    { value: "Alta", label: "Alta" },
    { value: "Media", label: "Média" },
    { value: "Baixa", label: "Baixa" },
]

interface PrioridadePopoverProps {
    error?: boolean
    errorMessage?: string
    onClearError?: () => void
}

export function PrioridadePopover({ error, errorMessage, onClearError }: PrioridadePopoverProps) {
    const [open, setOpen] = React.useState(false)
    const [showTextarea, setShowTextarea] = React.useState(false)
    const [justificativa, setJustificativa] = React.useState("")
    const [hasError, setHasError] = React.useState(false)
    const [showPing, setShowPing] = React.useState(false)
    const triggerRef = React.useRef<HTMLButtonElement | null>(null)
    const popoverRef = React.useRef<HTMLDivElement | null>(null)

    const [selectedPriority, setSelectedPriority] = useAtom(prioridadeAtom)
    const [, setGlobalJustificativa] = useAtom(justificativaAtom)

    // Efeito para mostrar o ping quando houver erro externo
    React.useEffect(() => {
        if (error) {
            setShowPing(true)
        } else {
            setShowPing(false)
        }
    }, [error])

    // 🟢 Seleciona uma prioridade
    const handleSelect = (selectedValue: string) => {
        setSelectedPriority(selectedValue)

        // Limpa o erro quando seleciona um valor
        if (onClearError) {
            onClearError()
        }

        if (selectedValue === "Alta") {
            setShowTextarea(true)
        } else {
            setShowTextarea(false)
            setOpen(false) // Fecha se não for "Alta"
        }
    }

    // 🟡 Volta para a seleção de prioridade
    const handleBackToOptions = () => {
        setShowTextarea(false)
        setJustificativa("")
        setHasError(false) // Remove o erro ao voltar
    }

    // 🟠 Salva a justificativa globalmente
    const handleSaveJustificativa = () => {
        if (!justificativa.trim()) {
            setHasError(true) // Define erro se justificativa estiver vazia
            return
        }

        setGlobalJustificativa(justificativa)
        setOpen(false)
        setShowTextarea(false)
        setHasError(false) // Remove o erro ao salvar

        // Limpa o erro externo também
        if (onClearError) {
            onClearError()
        }
    }

    // 🔒 Validação antes de fechar o popover
    const handleOpenChange = (isOpen: boolean) => {
        if (showTextarea && !justificativa.trim() && isOpen === false) {
            setHasError(true) // Define erro se tentar fechar sem justificativa
            return
        }
        setOpen(isOpen)
        setHasError(false) // Remove erro ao fechar corretamente
    }

    // Determina se deve mostrar o erro (interno ou externo)
    const shouldShowError = hasError || error

    return (
        <div className="relative w-full flex-1">
            <Popover open={open} onOpenChange={handleOpenChange} modal={false}>
                {/* 🎯 Botão Gatilho */}
                <PopoverTrigger asChild>
                    <Button
                        ref={triggerRef}
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={`w-full justify-between ${
                            shouldShowError ? "border-red-500" : ""
                        } ${hasError ? "animate-shake" : ""}`}
                        style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        <span className="truncate">{selectedPriority || "Selecione a prioridade"}</span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>

                {/* 🎯 Conteúdo do Popover */}
                <PopoverContent
                    ref={popoverRef}
                    className="p-0 overflow-hidden"
                    style={{
                        width: triggerRef.current?.offsetWidth || "auto",
                        maxWidth: triggerRef.current?.offsetWidth || "auto",
                    }}
                    align="start"
                    sideOffset={4}
                >
                    <div className="relative w-full">
                        <AnimatePresence initial={false} mode="wait">
                            {/* 🟢 Tela de Seleção de Prioridade */}
                            {!showTextarea ? (
                                <motion.div
                                    key="options"
                                    initial={{ opacity: 0, x: "-100%" }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: "-100%" }}
                                    transition={{ duration: 0.3 }}
                                    className="p-2 w-full"
                                >
                                    {PRIORIDADE_OPTIONS.map((option) => (
                                        <Button
                                            key={option.value}
                                            variant="ghost"
                                            className="w-full justify-start mb-1 text-sm"
                                            onClick={() => handleSelect(option.value)}
                                        >
                                            {option.label}
                                        </Button>
                                    ))}
                                </motion.div>
                            ) : (
                                // 🟡 Tela de Justificativa
                                <motion.div
                                    key="textarea"
                                    initial={{ opacity: 0, x: "100%" }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: "100%" }}
                                    transition={{ duration: 0.3 }}
                                    className="p-2 w-full"
                                    style={{
                                        width: "100%",
                                        maxWidth: "100%",
                                    }}
                                >
                                    <Textarea
                                        placeholder="Justifique a necessidade da alta prioridade..."
                                        value={justificativa}
                                        onChange={(e) => setJustificativa(e.target.value)}
                                        className={`h-[150px] w-full resize-none overflow-hidden ${hasError ? "border-red-500" : ""}`}
                                        autoFocus
                                        style={{
                                            width: "100%",
                                            maxWidth: "100%",
                                            boxSizing: "border-box",
                                        }}
                                    />
                                    <div className="flex gap-1 items-center justify-center mt-2 w-full">
                                        <Button
                                            variant="destructive"
                                            className="w-full"
                                            size="sm"
                                            onClick={handleBackToOptions}
                                            aria-label="Voltar para opções"
                                        >
                                            <ChevronLeft className="mr-1 h-3 w-3" />
                                            <span className="text-xs">Voltar</span>
                                        </Button>
                                        <Button
                                            className="w-full"
                                            size="sm"
                                            onClick={handleSaveJustificativa}
                                            disabled={!justificativa.trim()}
                                        >
                                            <Save className="mr-1 h-3 w-3" />
                                            <span className="text-xs">Salvar</span>
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
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
            {errorMessage && <p className="text-sm font-medium text-red-500 mt-1">{errorMessage}</p>}
        </div>
    )
}

