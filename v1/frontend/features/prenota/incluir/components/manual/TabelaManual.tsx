"use client";

import React, {useEffect, useState} from "react";
import {Trash2} from "lucide-react";
import {
    Input,
    ScrollArea,
    ScrollBar,
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "ui";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {AnimatedButton} from "#/incluir/components/buttons";
import {Produto} from "#/incluir/interfaces";
import {produtosAtom, totalGeralAtom, itensAtom} from "#/incluir/atoms";

interface Row extends Produto {
    id: string;
    isManual: boolean;
}

const TabelaManual = () => {
    const produtosDisponiveis = useAtomValue(produtosAtom);
    const [totalGeral, setTotalGeral] = useAtom(totalGeralAtom);
    const setItensAtomValue = useSetAtom(itensAtom);
    const [rows, setRows] = useState<Row[]>([]);

    const updateRow = (id: string, field: keyof Produto, value: string | number) => {
        setRows((prevRows) =>
            prevRows.map((row) => {
                if (row.id !== id) return row;

                let newValorTotal = row.valorTotal;
                if (field === "quantidade" || field === "precoUnitario") {
                    const newQty = field === "quantidade" ? Number(value) : row.quantidade;
                    const newPrice = field === "precoUnitario" ? Number(value) : row.precoUnitario;
                    newValorTotal = newQty * newPrice;
                }

                return {
                    ...row,
                    [field]: value,
                    valorTotal: newValorTotal,
                };
            })
        );
    };

    const removeRow = (id: string) => {
        setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    };

    const removeAllRows = () => {
        setRows([]);
    };

    useEffect(() => {
        const total = rows.reduce((acc, row) => acc + row.valorTotal, 0);
        setTotalGeral(total);
    }, [rows, setTotalGeral]);

    const formatCurrency = (value: number) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);

    useEffect(() => {
        if (produtosDisponiveis.length === 0) {
            setRows([]);
            return;
        }

        const uniqueIds = new Set();
        const produtosFormatados: Row[] = [];

        produtosDisponiveis.forEach((produto) => {
            const id = `${produto.codigo}-${produto.pedidoNumero}-${produto.itemPedido}`;
            if (!uniqueIds.has(id)) {
                uniqueIds.add(id);
                produtosFormatados.push({
                    ...produto,
                    id: id,
                    isManual: false,
                });
            }
        });

        setRows(produtosFormatados);
    }, [produtosDisponiveis]);

    useEffect(() => {
        const converted = rows.map((row, index) => ({
            ITEM: String(index + 1).padStart(4, "0"),
            PRODUTO: row.codigo || "",
            QUANTIDADE: row.quantidade || 0,
            VALUNIT: row.precoUnitario || 0,
            PRODFOR: "",
            DESCFOR: "",
            ORIGEMXML: "",
            TOTAL: row.valorTotal || 0,
            PC: row.pedidoNumero || "",
            ITEMPC: row.itemPedido || "",
            B1_UM: row.unidade || "",
            SEGUN: "",
            TPFATO: "",
            CONV: 1,
            ORIGEM: row.origem || "",
        }));
        setItensAtomValue(converted);
    }, [rows, setItensAtomValue]);

    return (
        <div className="flex flex-col h-full shadow-lg">
            <ScrollArea className="flex-1 rounded-md border bg-muted/30 overflow-x-auto">
                <div className="w-full overflow-x-auto">
                    <Table className="w-full border-collapse">
                        <TableHeader>
                            <TableRow>
                                <TableHead
                                    className="border-r border-b border dark:border-background/40 px-4 py-2 text-center text-base last:border-r-0 bg-muted font-semibold">
                                    Código
                                </TableHead>
                                <TableHead
                                    className="border-r border-b border dark:border-background/40 px-4 py-2 text-center text-base last:border-r-0 bg-muted font-semibold">
                                    Descrição
                                </TableHead>
                                <TableHead
                                    className="border-r border-b border dark:border-background/40 px-4 py-2 text-center text-base last:border-r-0 bg-muted font-semibold">
                                    Pedido
                                </TableHead>
                                <TableHead
                                    className="border-r border-b border dark:border-background/40 px-4 py-2 text-center text-base last:border-r-0 bg-muted font-semibold">
                                    NCM/SH
                                </TableHead>
                                <TableHead
                                    className="border-r border-b border dark:border-background/40 px-4 py-2 text-center text-base last:border-r-0 bg-muted font-semibold">
                                    Origem
                                </TableHead>
                                <TableHead
                                    className="border-r border-b border dark:border-background/40 px-4 py-2 text-center text-base last:border-r-0 bg-muted font-semibold">
                                    Unidade
                                </TableHead>
                                <TableHead
                                    className="border-r border-b border dark:border-background/40 px-4 py-2 text-center text-base last:border-r-0 bg-muted font-semibold">
                                    Quantidade
                                </TableHead>
                                <TableHead
                                    className="border-r border-b border dark:border-background/40 px-4 py-2 text-center text-base last:border-r-0 bg-muted font-semibold">
                                    Preço Unitário
                                </TableHead>
                                <TableHead
                                    className="border-r border-b border dark:border-background/40 px-4 py-2 text-center text-base last:border-r-0 bg-muted font-semibold">
                                    Valor Total
                                </TableHead>
                                <TableHead
                                    className="border-r border-b border dark:border-background/40 px-4 py-2 text-center text-base last:border-r-0 bg-muted font-semibold flex justify-end items-center">
                                    <AnimatedButton
                                        text="Excluir Todos"
                                        icon={<Trash2 className="size-7"/>}
                                        variant="destructive"
                                        onClick={removeAllRows}
                                    />
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="relative h-full">
                            {rows.length ? (
                                rows.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell className="px-4 py-2 text-center">
                                            {row.codigo || "-"}
                                        </TableCell>
                                        <TableCell className="px-4 py-2 text-center">
                                            {row.descricao || "-"}
                                        </TableCell>
                                        <TableCell className="px-4 py-2 text-center">
                                            {row.pedidoNumero || "-"}
                                        </TableCell>
                                        <TableCell className="px-4 py-2 text-center">
                                            {row.ncm || "-"}
                                        </TableCell>
                                        <TableCell className="px-4 py-2 text-center">
                                            {row.origem || "-"}
                                        </TableCell>
                                        <TableCell className="px-4 py-2 text-center">
                                            {row.unidade || "-"}
                                        </TableCell>
                                        <TableCell className="px-4 py-2 text-center">
                                            <Input
                                                type="number"
                                                min="0"
                                                className="border rounded w-full px-2 py-1 text-foreground"
                                                placeholder="Quantidade"
                                                value={row.quantidade}
                                                onChange={(e) =>
                                                    updateRow(row.id, "quantidade", Number(e.target.value))
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="px-4 py-2 text-center">
                                            <Input
                                                type="number"
                                                min="0"
                                                className="border rounded w-full px-2 py-1 text-foreground"
                                                placeholder="Preço Unitário"
                                                value={row.precoUnitario}
                                                onChange={(e) =>
                                                    updateRow(row.id, "precoUnitario", Number(e.target.value))
                                                }
                                            />
                                        </TableCell>
                                        <TableCell className="px-4 py-2 text-center">
                                            {formatCurrency(row.valorTotal)}
                                        </TableCell>
                                        <TableCell className="px-4 py-2 text-center flex justify-end items-center">
                                            <AnimatedButton
                                                text="Excluir"
                                                icon={<Trash2/>}
                                                variant="destructive"
                                                onClick={() => removeRow(row.id)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={10} className="h-full">
                                        <span
                                            className="fixed bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl z-50 text-muted-foreground">
                                          Selecione o Fornecedor e o pedido para adicionar os produtos
                                        </span>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>

                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={8} className="px-4 py-2 text-right font-semibold">
                                    Total Geral
                                </TableCell>
                                <TableCell className="px-4 py-2 text-center">
                                    {formatCurrency(totalGeral)}
                                </TableCell>
                                <TableCell/>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
                <ScrollBar orientation="horizontal"/>
            </ScrollArea>
        </div>
    );
};

export default TabelaManual;