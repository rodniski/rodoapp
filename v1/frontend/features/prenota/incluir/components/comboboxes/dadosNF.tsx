"use client"

import React, { useEffect } from "react"
import { useAtomValue, useSetAtom } from "jotai"
import { clearErrorAtom, condFinAtom, dataIncAtom, formErrorsAtom, tipoRodoAtom } from "#/incluir/atoms"
import { Card, CardContent, CardHeader, CardTitle, Combobox } from "ui"
import { ComboboxPedido, CondicaoPagamentoModal, PrioridadePopover } from "#/incluir/components/comboboxes"
import { Search } from "#/incluir/components/xml"
import { AnimatedButton } from "#/incluir/components/buttons"
import { PiggyBank } from "lucide-react"
import { TIPOS_NF_OPTIONS } from "#/dashboard/interfaces"

interface DadosNfProps {
    tipo?: "xml" | "manual"
}

const DadosNf: React.FC<DadosNfProps> = ({ tipo = "xml" }) => {
    const formErrors = useAtomValue(formErrorsAtom)
    const selectedTipoNF = useAtomValue(tipoRodoAtom)
    const setSelectedTipoNF = useSetAtom(tipoRodoAtom)
    const selectedCondicao = useAtomValue(condFinAtom)
    const [openModal, setOpenModal] = React.useState(false)
    const data = useAtomValue(dataIncAtom)
    const setClearError = useSetAtom(clearErrorAtom)

    // Verifica se o ComboboxPedido deve estar desabilitado
    const isPedidoDisabled = !data

    useEffect(() => {
        if (selectedCondicao) {
            setOpenModal(true)
        } else {
            setOpenModal(false)
        }
    }, [selectedCondicao])

    // Extrair erros específicos dos campos
    const tipoRodoError = formErrors["tiporodo"] || null
    const condFinError = formErrors["CONDFIN"] || null
    const prioridadeError = formErrors["prioridade"] || null
    const pagamentosError = formErrors["PAGAMENTOS"] || null

    return (
        <>
            <Card className="w-full flex flex-col h-full bg-background">
                {tipo === "xml" && (
                    <CardHeader className="w-full p-4">
                        <Search />
                    </CardHeader>
                )}
                {tipo === "manual" && (
                    <CardHeader>
                        <CardTitle className="text-center">Dados da NF</CardTitle>
                    </CardHeader>
                )}
                <CardContent className="flex flex-col h-full gap-4 justify-center w-full">
                    {/* Primeira linha: Botão "Condição" e ComboboxPedido */}
                    <div className="flex gap-3 w-full items-center">
                        <div className="relative">
                            <AnimatedButton
                                text="Condição"
                                icon={<PiggyBank />}
                                variant="outline"
                                onClick={() => setOpenModal(true)}
                                className={condFinError ? "border-red-500" : ""}
                            />
                            {condFinError && (
                                <div className="absolute -top-1 -right-1 z-10">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                                </div>
                            )}
                        </div>
                        {/* Passa a prop disabled para o ComboboxPedido */}
                        <div className="flex-1 w-full">
                            <ComboboxPedido
                                disabled={isPedidoDisabled}
                                error={!!pagamentosError}
                                errorMessage={pagamentosError}
                                onClearError={() => setClearError("PAGAMENTOS")}
                            />
                        </div>
                    </div>

                    {/* Segunda Linha - Usando flex-1 para garantir que ambos ocupem metade do espaço */}
                    <div className="flex gap-3 w-full">
                        <div className="flex-1">
                            <Combobox
                                items={TIPOS_NF_OPTIONS}
                                placeholder="Tipo de NF"
                                onSelect={(value) => {
                                    setSelectedTipoNF(value ?? "")
                                    if (value) setClearError("tiporodo")
                                }}
                                selectedValue={selectedTipoNF}
                                error={!!tipoRodoError}
                                errorMessage={tipoRodoError}
                                onClearError={() => setClearError("tiporodo")}
                            />
                        </div>
                        <div className="flex-1">
                            <PrioridadePopover
                                error={!!prioridadeError}
                                errorMessage={prioridadeError}
                                onClearError={() => setClearError("prioridade")}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {openModal && (
                <CondicaoPagamentoModal
                    condicao={selectedCondicao}
                    onClose={() => setOpenModal(false)}
                    isOpen={openModal}
                    error={!!condFinError}
                    errorMessage={condFinError}
                    onClearError={() => setClearError("CONDFIN")}
                />
            )}
        </>
    )
}

export default DadosNf

