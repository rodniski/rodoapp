"use client";

import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Combobox, ComboboxItem} from "ui";
import {useAtomValue, useSetAtom} from "jotai";
import {itensAtom, produtosAtom} from "#/incluir/atoms";
import {UnitConversionModal} from "#/incluir/components/table";

export type MappedProduto = {
    ITEM: string;
    PRODUTO: string;
    QUANTIDADE: number;
    VALUNIT: number;
    PRODFOR: string;
    DESCFOR: string;
    ORIGEMXML: string;
    TOTAL: number;
    PC: string;
    ITEMPC: string;
    B1_UM: string;
    SEGUN: string;
    TPFATO: string;
    CONV: number;
    ORIGEM: string;
};

interface ProdutoComboboxProps {
    selectedValue: string | null;
    xmlItem: MappedProduto;
}

interface CustomComboboxItemProps extends ComboboxItem {
    itempc?: string;
    cod?: string;
    saldo?: number;
    pedido?: string;
}

export const ProdutoCombobox: React.FC<ProdutoComboboxProps> = ({
                                                                    selectedValue,
                                                                    xmlItem,
                                                                }) => {
    const produtosProtheus = useAtomValue(produtosAtom);
    const setItens = useSetAtom(itensAtom);
    const [localSelected, setLocalSelected] = useState<string | null>(selectedValue);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [produtoParaConverter, setProdutoParaConverter] = useState<any>(null);

    useEffect(() => {
        setLocalSelected(selectedValue);
    }, [selectedValue]);

    const comboboxItems: CustomComboboxItemProps[] = useMemo(() => {
        const uniqueKeys = new Set<string>();
        const uniqueItems: CustomComboboxItemProps[] = [];

        for (const produto of produtosProtheus) {
            const compositeKey = `${produto.codigo}-${produto.itemPedido}-${produto.quantidade}`;
            if (!uniqueKeys.has(compositeKey)) {
                uniqueKeys.add(compositeKey);
                uniqueItems.push({
                    value: compositeKey,
                    label: `${produto.itemPedido} - ${produto.descricao}`,
                    itempc: produto.itemPedido || "",
                    cod: produto.codigo || "",
                    pedido: produto.pedidoNumero || "",
                    saldo: produto.quantidade || 0,
                });
            }
        }
        return uniqueItems;
    }, [produtosProtheus]);

    const handleSelect = useCallback(
        (codigo: string | null) => {
            if (!codigo) {
                setItens((prev) => prev.filter((item) => item.ITEM !== xmlItem.ITEM));
                setLocalSelected(null);
                return;
            }

            const produtoSelecionado = produtosProtheus.find(
                (p) => `${p.codigo}-${p.itemPedido}-${p.quantidade}` === codigo
            );

            if (!produtoSelecionado) {
                setItens((prev) => prev.filter((item) => item.ITEM !== xmlItem.ITEM));
                setLocalSelected(null);
                return;
            }

            // Verificação de unidade corrigida
            if (produtoSelecionado.unidade?.toUpperCase() !== xmlItem.B1_UM?.toUpperCase()) {
                setProdutoParaConverter(produtoSelecionado);
                setIsModalOpen(true);
                return; // Sai da função até a conversão ser concluída
            }

            // Atualiza os itens normalmente se as unidades forem compatíveis
            setItens((prev) => {
                const existingIndex = prev.findIndex((item) => item.ITEM === xmlItem.ITEM);
                const newItem = {
                    ...xmlItem,
                    PRODUTO: produtoSelecionado.codigo,
                    PC: produtoSelecionado.pedidoNumero || "",
                    ITEMPC: produtoSelecionado.itemPedido || "",
                    B1_UM: produtoSelecionado.unidade || xmlItem.B1_UM,
                    ORIGEM: produtoSelecionado.origem || xmlItem.ORIGEM,
                    selectedProduto: codigo,
                };

                return existingIndex < 0
                    ? [...prev, newItem]
                    : prev.map((item, i) => (i === existingIndex ? newItem : item));
            });

            setLocalSelected(codigo);
        },
        [produtosProtheus, setItens, xmlItem]
    );

    const handleOnSelect = useCallback(
        (value: string | null) => {
            if (value === localSelected) {
                setItens((prev) => prev.filter((item) => item.ITEM !== xmlItem.ITEM));
                setLocalSelected(null);
            } else {
                handleSelect(value);
            }
        },
        [localSelected, xmlItem.ITEM, handleSelect, setItens]
    );

    const handleSaveConversion = useCallback(
        (convertedQuantity: number, segundaUnidade?: string) => {
            if (!produtoParaConverter) return;

            setItens((prev) => {
                const existingIndex = prev.findIndex((item) => item.ITEM === xmlItem.ITEM);
                const updatedItem = {
                    ...xmlItem,
                    PRODUTO: produtoParaConverter.codigo,
                    PC: produtoParaConverter.pedidoNumero || "",
                    ITEMPC: produtoParaConverter.itemPedido || "",
                    ORIGEM: produtoParaConverter.origem || xmlItem.ORIGEM,
                    selectedProduto: `${produtoParaConverter.codigo}-${produtoParaConverter.itemPedido}-${produtoParaConverter.quantidade}`,
                    QUANTIDADE: convertedQuantity,
                    B1_UM: segundaUnidade || produtoParaConverter.unidade || xmlItem.B1_UM,
                };

                if (updatedItem.QUANTIDADE > 0) {
                    updatedItem.VALUNIT = updatedItem.TOTAL / updatedItem.QUANTIDADE;
                }

                return existingIndex < 0
                    ? [...prev, updatedItem]
                    : prev.map((item, i) => (i === existingIndex ? updatedItem : item));
            });

            setLocalSelected(`${produtoParaConverter.codigo}-${produtoParaConverter.itemPedido}-${produtoParaConverter.quantidade}`);
            setIsModalOpen(false);
            setProdutoParaConverter(null);
        },
        [xmlItem, setItens, produtoParaConverter]
    );

    return (
        <>
            <Combobox
                items={comboboxItems}
                placeholder="Selecione um produto do pedido"
                selectedValue={localSelected}
                onSelect={handleOnSelect}
                itemRender={(item) => (
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          {item.cod} - Saldo: {item.saldo} - Pedido: {item.pedido}
                        </span>
                        <span>{item.label}</span>
                    </div>
                )}
                // Isto customiza o que aparece no "campo" quando algo está selecionado.
                renderSelected={(item) => (
                    <div className="flex flex-col items-start text-start">
                            <span className="text-xs">
                              Pedido: {item.pedido}
                            </span>
                        <span className="text-sm">{item.label}</span>
                    </div>
                )}
            />
            <UnitConversionModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setProdutoParaConverter(null);
                }}
                produto={produtoParaConverter}
                pedidoUnidade={produtoParaConverter?.unidade || ""}
                xmlUnidade={xmlItem.B1_UM}
                xmlQuantidade={xmlItem.QUANTIDADE}
                pedidoQuantidade={produtoParaConverter?.quantidade || 0}
                onSave={handleSaveConversion}
            />
        </>
    );
};