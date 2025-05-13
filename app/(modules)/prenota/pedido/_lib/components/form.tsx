"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Input,
  Label,
  Combobox,
  Textarea, // Re-adicionando Textarea se for usada para OBS do pedido
  // Componentes da Tabela
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "ui";
import {
  usePedidoCompraStore,
  usePostPedidoCompra,
  type PedidoCompraItem, // Certifique-se que este tipo é importado corretamente
  type PedidoCompraRequest,
} from ".."; // Ajuste o caminho se necessário
import { toast } from "sonner";
import { useFilialOptions } from "utils";
import { FornecedorDialog } from "./fornecedor";
import { useAuxStore } from "@login/stores/aux-store";
import { TIPOS_NF_OPTIONS } from "@/app/(modules)/prenota/_lib/config/constants";

// Importações para o editor de item integrado
import { PackageSearch, XCircle, PlusCircle } from "lucide-react";
import { ProdutoDialog } from "."; // Assumindo que ProdutoDialog está em ./ProdutoDialog.tsx
import { type ClientProductSearchResult } from "../config/type.produto"; // Ajuste o caminho

export function IncludePedidoCard() {
  const filialOptions = useFilialOptions();
  const condicoes = useAuxStore((s) => s.condicoes) || [];
  const condFinOptions = condicoes.map((c) => ({
    value: c.E4_CODIGO,
    label: `${c.E4_CODIGO} - ${c.E4_DESCRI}`,
  }));

  // Store do Pedido de Compra
  const draft = usePedidoCompraStore((state) => state.draft);
  const setDraft = usePedidoCompraStore((state) => state.setDraft);
  const clearDraft = usePedidoCompraStore((state) => state.clearDraft);
  const addItemAction = usePedidoCompraStore((state) => state.addItem);
  const updateItemAction = usePedidoCompraStore((state) => state.updateItem);
  const removeItemAction = usePedidoCompraStore((state) => state.removeItem);
  const generateNextItemCode = usePedidoCompraStore(
    (state) => state.generateNextItemCode
  );

  const { createPedido, isLoading } = usePostPedidoCompra();

  // Estado para controlar qual diálogo de produto de item está aberto
  const [produtoDialogState, setProdutoDialogState] = useState<{
    open: boolean;
    itemIndex: number | null;
  }>({ open: false, itemIndex: null });

  // Estados locais para os inputs de cada item (para melhor UX)
  // Usaremos um objeto para armazenar os valores locais por índice de item
  const [localItemValues, setLocalItemValues] = useState<
    Record<number, { quantidade: string; valorUnit: string }>
  >({});

  // Sincronizar estados locais com o store quando os itens do draft mudarem
  useEffect(() => {
    const newLocalValues: Record<
      number,
      { quantidade: string; valorUnit: string }
    > = {};
    draft.ITENS.forEach((item, index) => {
      newLocalValues[index] = {
        quantidade: item.QUANTIDADE?.toString() ?? "1",
        valorUnit: item.VALUNIT?.toString() ?? "0",
      };
    });
    setLocalItemValues(newLocalValues);
  }, [draft.ITENS]);

  const handleProductSelect = useCallback(
    (itemIndex: number, produto: ClientProductSearchResult) => {
      const currentItem = draft.ITENS[itemIndex];
      const itemPatch: Partial<PedidoCompraItem> = {
        PRODUTO: produto.B1_COD,
        VALUNIT: produto.B1_PRV1 ?? 0,
        QUANTIDADE: currentItem?.QUANTIDADE ?? 1, // Mantém qtd ou define 1 se novo
        // DESC_PROD: produto.B1_DESC, // Se quiser armazenar a descrição no item
      };
      updateItemAction(itemIndex, itemPatch);
      setProdutoDialogState({ open: false, itemIndex: null }); // Fecha o diálogo
    },
    [updateItemAction, draft.ITENS]
  );

  const handleNumericInputBlur = (
    itemIndex: number,
    field: "QUANTIDADE" | "VALUNIT",
    localValue: string
  ) => {
    const currentItem = draft.ITENS[itemIndex];
    let numericValue = parseFloat(localValue);

    if (isNaN(numericValue) || numericValue < 0) {
      numericValue =
        field === "QUANTIDADE"
          ? currentItem?.QUANTIDADE ?? 1
          : currentItem?.VALUNIT ?? 0;
    }
    if (field === "VALUNIT") {
      numericValue = parseFloat(numericValue.toFixed(4));
    }
    if (field === "QUANTIDADE" && numericValue === 0) {
      // Não permitir quantidade 0, por exemplo
      numericValue = 1;
      toast.info("Quantidade não pode ser zero. Definido para 1.");
    }

    setLocalItemValues((prev) => ({
      ...prev,
      [itemIndex]: {
        ...prev[itemIndex],
        [field === "QUANTIDADE" ? "quantidade" : "valorUnit"]:
          numericValue.toString(),
      },
    }));
    updateItemAction(itemIndex, { [field]: numericValue });
  };

  const handleAddNewItem = () => {
    const newItemCode = generateNextItemCode();
    const novoItem: PedidoCompraItem = {
      ITEM: newItemCode,
      PRODUTO: "",
      QUANTIDADE: 1,
      VALUNIT: 0,
      // Adicione outros campos obrigatórios de PedidoCompraItem aqui
      // Ex: DESC_PROD: "",
    };
    addItemAction(novoItem);
  };

  const handleSubmit = () => {
    if (!draft.ITENS || draft.ITENS.length === 0) {
      toast.error("O pedido deve conter ao menos um item.");
      return;
    }
    if (!draft.FILIAL) {
      toast.error("Filial é obrigatória.");
      return;
    }
    if (!draft.FORNECEDOR || !draft.LOJA) {
      toast.error("Fornecedor e Loja são obrigatórios.");
      return;
    }
    // Validar se todos os itens têm produto selecionado
    for (const item of draft.ITENS) {
      if (!item.PRODUTO || item.PRODUTO.trim() === "") {
        toast.error(`O item ${item.ITEM} não tem um produto selecionado.`);
        return;
      }
      if (item.QUANTIDADE <= 0) {
        toast.error(
          `A quantidade para o item ${item.ITEM} (${item.PRODUTO}) deve ser maior que zero.`
        );
        return;
      }
    }

    console.log("Enviando Pedido de Compra:", draft);
    createPedido(draft, {
      onSuccess: (data) => {
        const isSuccess =
          data.Sucesso !== undefined ? data.Sucesso : (data as any).success;
        const message = data.Mensagem || (data as any).message;
        if (isSuccess) {
          toast.success(message || "Pedido de compra criado com sucesso!");
          clearDraft();
        } else {
          toast.error(message || "Falha ao criar pedido de compra.");
        }
      },
      onError: (err) => {
        toast.error(err.message || "Ocorreu um erro ao criar o pedido.");
      },
    });
  };

  const handleCancel = () => {
    clearDraft();
    toast.info("Criação de pedido cancelada.");
  };

  return (
    <Card className="w-full max-w-5xl mx-auto z-30">
      {" "}
      {/* Aumentado max-w para acomodar a tabela */}
      <CardHeader>
        <CardTitle>Novo Pedido de Compra</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campos do Cabeçalho */}
          <div>
            <Label htmlFor="filial">Filial*</Label>
            <Combobox
              items={filialOptions}
              selectedValue={draft.FILIAL || undefined}
              onSelect={(v) => setDraft({ FILIAL: v ?? "" })}
              placeholder="Selecione a filial"
            />
          </div>
          <div>
            <Label htmlFor="filialEntrega">Filial Entrega</Label>
            <Combobox
              items={filialOptions}
              selectedValue={draft.FILENTREGA || undefined}
              onSelect={(v) => setDraft({ FILENTREGA: v ?? "" })}
              placeholder="Selecione filial de entrega"
            />
          </div>
          <div>
            <Label htmlFor="fornecedor">Fornecedor*</Label>
            <FornecedorDialog />
          </div>
          <div>
            <Label htmlFor="loja">Loja*</Label>
            <Input
              id="loja"
              value={draft.LOJA}
              readOnly
              className="bg-muted/50"
              placeholder="Loja do fornecedor"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="contato">Contato</Label>
            <Input
              id="contato"
              value={draft.CONTATO}
              onChange={(e) => setDraft({ CONTATO: e.target.value })}
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="obs">Observações</Label>
            <Textarea
              id="obs"
              value={draft.OBS}
              onChange={(e) => setDraft({ OBS: e.target.value })}
              rows={3}
            />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="condfin">Condição Financeira</Label>
            <Combobox
              items={condFinOptions}
              selectedValue={draft.CONDFIN || undefined}
              onSelect={(v) => setDraft({ CONDFIN: v ?? "" })}
              placeholder="Selecione condição"
            />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="tipoped">Tipo de Pedido</Label>
            <Combobox
              items={TIPOS_NF_OPTIONS}
              selectedValue={draft.TIPOPED || undefined}
              onSelect={(v) => setDraft({ TIPOPED: v ?? "" })}
              placeholder="Selecione tipo de pedido"
            />
          </div>
        </div>

        {/* Tabela de Itens Integrada */}
        <div className="col-span-2 space-y-2">
          <Label className="text-base font-medium">Itens do Pedido*</Label>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px] px-2 py-3">Item</TableHead>
                  <TableHead className="min-w-[280px] px-2 py-3">
                    Produto
                  </TableHead>
                  <TableHead className="w-[120px] px-2 py-3">Qtd.</TableHead>
                  <TableHead className="w-[150px] px-2 py-3">
                    Vlr. Unit.
                  </TableHead>
                  <TableHead className="w-[60px] px-2 py-3 text-right">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {draft.ITENS.length > 0 ? (
                  draft.ITENS.map((item, index) => {
                    const produtoDisplay = item.PRODUTO
                      ? `${item.PRODUTO}`
                      : "Selecionar produto";

                    const currentLocalValues = localItemValues[index] || {
                      quantidade: "1",
                      valorUnit: "0",
                    };

                    return (
                      <TableRow
                        key={item.ITEM || `item-editor-${index}`}
                        className="hover:bg-muted/50"
                      >
                        <TableCell className="p-2 align-middle">
                          <Input
                            value={item.ITEM}
                            readOnly
                            className="bg-muted/50 border-dashed h-9 text-sm w-full"
                            aria-label={`Código do item ${item.ITEM}`}
                          />
                        </TableCell>
                        <TableCell className="p-2 align-middle">
                          <Button
                            variant="outline"
                            onClick={() =>
                              setProdutoDialogState({
                                open: true,
                                itemIndex: index,
                              })
                            }
                            className="w-full justify-between text-left truncate h-9 text-sm"
                          >
                            <span className="truncate">{produtoDisplay}</span>
                            <PackageSearch className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </TableCell>
                        <TableCell className="p-2 align-middle">
                          <Input
                            type="number"
                            value={currentLocalValues.quantidade}
                            onChange={(e) =>
                              setLocalItemValues((prev) => ({
                                ...prev,
                                [index]: {
                                  ...prev[index],
                                  quantidade: e.target.value,
                                },
                              }))
                            }
                            onBlur={() =>
                              handleNumericInputBlur(
                                index,
                                "QUANTIDADE",
                                currentLocalValues.quantidade
                              )
                            }
                            min="0.0001"
                            step="any"
                            className="h-9 text-sm w-full"
                            aria-label="Quantidade do item"
                          />
                        </TableCell>
                        <TableCell className="p-2 align-middle">
                          <Input
                            type="number"
                            value={currentLocalValues.valorUnit}
                            onChange={(e) =>
                              setLocalItemValues((prev) => ({
                                ...prev,
                                [index]: {
                                  ...prev[index],
                                  valorUnit: e.target.value,
                                },
                              }))
                            }
                            onBlur={() =>
                              handleNumericInputBlur(
                                index,
                                "VALUNIT",
                                currentLocalValues.valorUnit
                              )
                            }
                            min="0"
                            step="any"
                            className="h-9 text-sm w-full"
                            aria-label="Valor unitário do item"
                          />
                        </TableCell>
                        <TableCell className="p-2 text-right align-middle">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItemAction(index)}
                            aria-label="Remover item"
                            className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 h-9 w-9"
                          >
                            <XCircle className="h-5 w-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Nenhum item adicionado ao pedido. Clique em "Adicionar
                      Item" abaixo.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* Diálogo de Produto (Renderizado uma vez, controlado por estado) */}
          {produtoDialogState.itemIndex !== null && (
            <ProdutoDialog
              open={produtoDialogState.open}
              onOpenChange={(open) =>
                setProdutoDialogState({
                  open,
                  itemIndex: open ? produtoDialogState.itemIndex : null,
                })
              }
              onProductSelect={(produto) =>
                handleProductSelect(produtoDialogState.itemIndex!, produto)
              }
              currentSelectedProductCode={
                draft.ITENS[produtoDialogState.itemIndex!]?.PRODUTO
              }
            />
          )}
          <div className="mt-4 flex justify-start">
            <Button
              variant="outline"
              onClick={handleAddNewItem}
              className="gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Adicionar Item
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 mt-6">
        <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Pedido"}
        </Button>
      </CardFooter>
    </Card>
  );
}
