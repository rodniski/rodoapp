"use client"

import {useEffect, useMemo, useState} from "react"
import {useAtomValue, useSetAtom} from "jotai"
import {condFinAtom, fornecedorAtom, fornecedorSupAtom, lojaAtom, produtosAtom} from "#/incluir/atoms"
import {getOrderOptions, usePedidosUnified} from "#/incluir/hooks"
import {type ComboboxItem, ComboboxMultiplo, TooltipProvider} from "ui"
import type {FornecedorAPI, PedidoAPI, Produto} from "#/incluir/interfaces"
import {toast} from "sonner"

// Adicione a prop onClearError
export interface ComboboxPedidoProps {
    disabled?: boolean
    error?: boolean
    errorMessage?: string
    onClearError?: () => void
}

export function ComboboxPedido({disabled, error, errorMessage, onClearError}: ComboboxPedidoProps): JSX.Element {
    const [selectedValues, setSelectedValues] = useState<string[]>([])
    const fornecedorCnpj = useAtomValue(fornecedorSupAtom)
    const setProdutos = useSetAtom(produtosAtom)
    const setLoja = useSetAtom(lojaAtom)
    const setCodEmitente = useSetAtom(fornecedorAtom)
    const setCondFin = useSetAtom(condFinAtom)

    const {
        data: fornecedoresAPI,
        isLoading,
        error: apiError,
        isError,
        refetch,
    } = usePedidosUnified({cnpj: fornecedorCnpj})

    const fornecedores: FornecedorAPI[] = fornecedoresAPI || []

    useEffect(() => {
        if (fornecedores && selectedValues.length > 0 && fornecedorCnpj) {
            const primeiroPedidoSelecionado = selectedValues[0]

            const fornecedorCorreto = fornecedores.find(
                (fornecedorAPI) => fornecedorAPI.A2_CGC?.trim() === fornecedorCnpj?.trim(),
            )

            if (fornecedorCorreto) {
                const lojaDoFornecedor = fornecedorCorreto.A2_LOJA?.trim()
                const codigoDoFornecedor = fornecedorCorreto.A2_COD

                if (lojaDoFornecedor) {
                    setLoja(lojaDoFornecedor)
                }
                if (codigoDoFornecedor) {
                    setCodEmitente(codigoDoFornecedor)
                }

                const pedidoSelecionado: PedidoAPI | undefined = fornecedorCorreto.PEDIDOS?.find(
                    (pedidoAPI) => pedidoAPI.C7_NUM === primeiroPedidoSelecionado,
                )

                if (pedidoSelecionado) {
                    const primeiraCondicaoPagamento = pedidoSelecionado.C7_COND?.trim()
                    if (primeiraCondicaoPagamento) {
                        setCondFin(primeiraCondicaoPagamento)
                    }
                }
            } else {
                console.error("Fornecedor não encontrado na lista.")
                toast({
                    title: "Erro",
                    description: "Fornecedor não encontrado.",
                    variant: "destructive",
                })
            }
        } else {
            setLoja("")
            setCodEmitente("")
            setCondFin("")
        }
    }, [fornecedores, selectedValues, setLoja, setCodEmitente, setCondFin, fornecedorCnpj])

    useEffect(() => {
        if (fornecedorCnpj) {
            refetch()
        }
    }, [fornecedorCnpj, refetch])

    useEffect(() => {
        setSelectedValues([])
        setLoja("")
        setCodEmitente("")
        setCondFin("")
    }, [fornecedorCnpj, setLoja, setCodEmitente, setCondFin])

    // Memo para otimizar as opções do Combobox (AGRUPANDO PEDIDOS POR C7_NUM!)
    const orderOptions: ComboboxItem[] = useMemo(() => {
        // 1. Extrai todos os "itens de pedido" (PedidoAPI[]) de todos os fornecedores
        const todosItensDePedido: PedidoAPI[] = fornecedores.reduce(
            (itensAcumulados: PedidoAPI[], fornecedorAPI: FornecedorAPI) => {
                return fornecedorAPI.PEDIDOS ? itensAcumulados.concat(fornecedorAPI.PEDIDOS) : itensAcumulados
            },
            [] as PedidoAPI[],
        )

        // 2. Agrupa os "itens de pedido" por C7_NUM para obter PEDIDOS ÚNICOS
        const pedidosUnicosAgrupados: Record<string, PedidoAPI> = todosItensDePedido.reduce(
            (pedidosAgrupados: Record<string, PedidoAPI>, itemDePedido: PedidoAPI) => {
                if (!pedidosAgrupados[itemDePedido.C7_NUM]) {
                    pedidosAgrupados[itemDePedido.C7_NUM] = itemDePedido // Pega o primeiro item de pedido com este C7_NUM
                }
                return pedidosAgrupados
            },
            {} as Record<string, PedidoAPI>,
        )

        // 3. Converte o objeto de pedidos únicos agrupados de volta para um array de PedidoAPI[]
        const pedidosUnicosArray: PedidoAPI[] = Object.values(pedidosUnicosAgrupados)

        // 4. Retorna as orderOptions usando APENAS os pedidos únicos!
        return getOrderOptions(pedidosUnicosArray)
    }, [fornecedores])

    // Log para depurar o salvamento dos produtos
    useEffect(() => {
        console.log("Debug - selectedValues:", selectedValues)
        console.log("Debug - fornecedores:", fornecedores)
        if (!fornecedores || selectedValues.length === 0) {
            setProdutos([])
            console.log("Debug - Sem fornecedores ou nenhum pedido selecionado. Produtos setados como vazio.")
            return
        }

        let todosProdutos: Produto[] = []

        selectedValues.forEach((selectedValue) => {
            console.log("Debug - Processando selectedValue:", selectedValue)

            const fornecedorCorreto = fornecedores.find(
                (fornecedorAPI) => fornecedorAPI.A2_CGC?.trim() === fornecedorCnpj?.trim(),
            )
            if (!fornecedorCorreto) {
                console.error("Debug - Fornecedor não encontrado para CNPJ:", fornecedorCnpj)
                return
            }
            console.log("Debug - Fornecedor encontrado:", fornecedorCorreto)

            const pedidoSelecionado: PedidoAPI | undefined = fornecedorCorreto.PEDIDOS?.find(
                (pedidoAPI) => pedidoAPI.C7_NUM === selectedValue,
            )
            if (!pedidoSelecionado) {
                console.error("Debug - Pedido não encontrado para selectedValue:", selectedValue)
            } else {
                console.log("Debug - Pedido encontrado:", pedidoSelecionado)
            }

            const produtosDoPedido: Produto[] = fornecedores.reduce(
                (produtosAcumulados: Produto[], fornecedorAPI: FornecedorAPI) => {
                    fornecedorAPI.PEDIDOS?.forEach((pedidoAPI) => {
                        if (pedidoAPI.C7_NUM === selectedValue) {
                            const produto: Produto = {
                                itemPedido: pedidoAPI.C7_ITEM,
                                codigo: pedidoAPI.C7_PRODUTO,
                                descricao: pedidoAPI.B1_DESC,
                                quantidade: pedidoAPI.C7_QUANT,
                                precoUnitario: pedidoAPI.C7_PRECO,
                                valorTotal: pedidoAPI.C7_TOTAL,
                                condicaoPagamento: pedidoAPI.C7_COND,
                                ncm: pedidoAPI.B1_POSIPI,
                                origem: pedidoAPI.B1_ORIGEM,
                                unidade: pedidoAPI.B1_UM,
                                localPadrao: pedidoAPI.B1_LOCPAD,
                                tipo: pedidoAPI.B1_TIPO,
                                grupoTributario: pedidoAPI.B1_GRTRIB,
                                grupoProduto: pedidoAPI.B1_GRUPO,
                                numero: pedidoAPI.C7_NUM,
                                pedidoNumero: pedidoAPI.C7_NUM,
                                status: pedidoAPI.STATUS,
                            }
                            console.log("Debug - Adicionando produto:", produto)
                            produtosAcumulados.push(produto)
                        }
                    })
                    return produtosAcumulados
                },
                [] as Produto[],
            )

            console.log("Debug - produtosDoPedido para selectedValue", selectedValue, ":", produtosDoPedido)
            todosProdutos = [...todosProdutos, ...produtosDoPedido]
        })

        console.log("Debug - Todos os produtos finais:", todosProdutos)
        setProdutos(todosProdutos)
    }, [selectedValues, fornecedores, setProdutos, fornecedorCnpj])

    const disabledReason = useMemo(() => {
        if (disabled) {
            return "Selecione uma data de emissão."
        }
        if (isLoading) {
            return "Carregando pedidos..."
        }
        if (!fornecedorCnpj) {
            return "Selecione um fornecedor."
        }
        if (orderOptions.length === 0) {
            return "Nenhum pedido encontrado."
        }
        return undefined
    }, [disabled, isLoading, fornecedorCnpj, orderOptions.length])

    // Modifique para passar o onClearError para o ComboboxMultiplo
    return (
        <TooltipProvider>
            <div className={"w-full"}>
                <ComboboxMultiplo
                    items={orderOptions}
                    placeholder="Selecione um ou mais pedidos..."
                    onSelect={(values: string[]) => {
                        setSelectedValues(values)
                        // Se selecionou algum valor e existe a função para limpar erro, chama ela
                        if (values.length > 0 && onClearError) {
                            onClearError()
                        }
                    }}
                    selectedValues={selectedValues}
                    renderSelected={(item: ComboboxItem) => item.label}
                    disabled={!!disabledReason}
                    disabledReason={disabledReason}
                    pedidos={fornecedores.reduce((pedidosAcumulados: PedidoAPI[], fornecedorAPI: FornecedorAPI) => {
                        return fornecedorAPI.PEDIDOS ? pedidosAcumulados.concat(fornecedorAPI.PEDIDOS) : pedidosAcumulados
                    }, [] as PedidoAPI[])}
                    error={error}
                    errorMessage={errorMessage}
                    onClearError={onClearError}
                />
                {isError && <p className="text-sm font-medium text-red-500 mt-1">Erro: {apiError?.message}</p>}
            </div>
        </TooltipProvider>
    )
}

