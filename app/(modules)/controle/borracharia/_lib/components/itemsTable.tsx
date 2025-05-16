import React, {useEffect, useState} from "react";
import {NumericInput, Progress, ScrollArea, Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "ui";
import {ItemNF} from "@/app/(modules)/controle/borracharia/_lib/types/index";
import {Loader2} from "lucide-react";
import {useListaItensNF} from "../hooks/hook.useListaItensNF";

interface ItemsTableProps {
    filial: string;
    doc: string;
    serie: string;
    codCliente: string;
    loja: string;
    onItemsChange: (items: ItemNF[]) => void; // Tipado explicitamente como ItemNF[]
}

const ItemsTable: React.FC<ItemsTableProps> = ({
                                                   filial,
                                                   doc,
                                                   serie,
                                                   codCliente,
                                                   loja,
                                                   onItemsChange,
                                               }) => {
    const {
        data: itensNF,
        isLoading,
        error,
        isError,
    } = useListaItensNF(
        {
            Filial: filial,
            Doc: doc,
            Serie: serie,
            CodCliente: codCliente,
            Loja: loja,
        },
        !!filial && !!doc && !!serie && !!codCliente && !!loja
    );

    const [localItens, setLocalItens] = useState<ItemNF[] | undefined>(itensNF);

    // Atualizar localItens e notificar o pai via callback
    useEffect(() => {
        if (itensNF) {
            console.log("Itens recebidos da API:", itensNF);
            const newItems = itensNF;
            setLocalItens(newItems);
            onItemsChange(newItems); // Notificar o pai imediatamente quando os dados chegarem
        }
    }, [itensNF, onItemsChange]);

    const handleQuantidadeChange = (itemId: string, value: number) => {
        if (!localItens) return;

        const updatedItems = localItens.map((item) =>
            item.Item === itemId
                ? {
                    ...item,
                    SaldoSelecionado: Math.min(Math.max(value, 0), item.Saldo),
                }
                : item
        );

        setLocalItens(updatedItems);
        onItemsChange(updatedItems); // Notificar o pai sempre que houver mudança
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-6">
                <Loader2 className="h-6 w-6 animate-spin"/>
                <span className="ml-2">Carregando itens...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-4 text-red-500">
                Erro ao carregar itens: {(error as Error)?.message || "Erro desconhecido"}
            </div>
        );
    }

    if (!localItens || localItens.length === 0) {
        return (
            <div className="p-4">
                Nenhum item encontrado. Verifique os parâmetros: Filial={filial}, Doc={doc},
                Serie={serie}, CodCliente={codCliente}, Loja={loja}
            </div>
        );
    }

    return (
        <ScrollArea className="h-full overflow-auto shadow border rounded bg-muted/50 dark:bg-background/60 max-w-[800px]">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-center">Produto</TableHead>
                        <TableHead className="text-center">Saldo</TableHead>
                        <TableHead className="text-center">Quantidade a Entregar</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {localItens.map((itemNF) => {
                        // Calcular o percentual para o progress:
                        const percentage = itemNF.Saldo
                            ? (itemNF.SaldoSelecionado / itemNF.Saldo) * 100
                            : 0;

                        return (
                            <React.Fragment key={itemNF.Item}>
                                <TableRow className="text-center">
                                    <TableCell>{itemNF.ProdutoLabel}</TableCell>
                                    <TableCell>{itemNF.Saldo}</TableCell>
                                    <TableCell className="flex justify-center items-center">
                                        <NumericInput
                                            min={0}
                                            max={itemNF.Saldo}
                                            value={itemNF.SaldoSelecionado}
                                            onChange={(newValue : number) => {
                                                handleQuantidadeChange(itemNF.Item, newValue);
                                            }}
                                        />
                                    </TableCell>
                                </TableRow>

                                {/* Nova linha para o progress */}
                                <TableRow>
                                    {/* Usamos colSpan para preencher a largura da tabela */}
                                    <TableCell colSpan={3} className="p-0">
                                        <Progress value={percentage} className="h-1"/>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        );
                    })}
                </TableBody>
            </Table>
        </ScrollArea>
    );
};

export default ItemsTable;
