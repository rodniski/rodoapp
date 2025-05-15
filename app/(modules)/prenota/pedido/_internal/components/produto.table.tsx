import React, { useState, useEffect, useCallback } from "react";
import { Button, Input, Label, TableCell, TableRow } from "ui"; // Adicionado TableCell, TableRow
import { PackageSearch, XCircle } from "lucide-react";
import { ProdutoDialog } from ".";
import { type ClientProductSearchResult } from "../config/type.produto";
import { usePedidoCompraStore, type PedidoCompraItem } from "..";

interface PedidoCompraItemEditorProps {
  itemIndex: number;
  onRemoveItem: (index: number) => void; // Mantido para o botão de remover
  // portalContainer?: HTMLElement | null; // Se o ProdutoDialog precisar
}

export function PedidoCompraItemEditor({
  itemIndex,
  onRemoveItem,
}: PedidoCompraItemEditorProps) {
  // Aceder ao item específico e à action de atualização do store
  const itemData = usePedidoCompraStore((state) => state.draft.ITENS[itemIndex]);
  const updateItemAction = usePedidoCompraStore((state) => state.updateItem);

  // Estados locais para os inputs, para melhor UX ao digitar
  const [isProdutoDialogOpen, setIsProdutoDialogOpen] = useState(false);
  const [localQuantidade, setLocalQuantidade] = useState<string>("");
  const [localValorUnit, setLocalValorUnit] = useState<string>("");

  // Sincronizar estados locais com o store quando o itemData mudar
  useEffect(() => {
    setLocalQuantidade(itemData?.QUANTIDADE?.toString() ?? "1");
    setLocalValorUnit(itemData?.VALUNIT?.toString() ?? "0");
  }, [itemData?.QUANTIDADE, itemData?.VALUNIT, itemData?.PRODUTO]); // Adicionado itemData.PRODUTO para resetar VlrUnit.

  const handleProductSelect = useCallback(
    (produto: ClientProductSearchResult) => {
      const itemPatch: Partial<PedidoCompraItem> = {
        PRODUTO: produto.B1_COD,
        VALUNIT: produto.B1_PRV1 ?? 0, // Atualiza o valor unitário com o preço do produto
        // Se QUANTIDADE ainda não estiver definida, define como 1
        QUANTIDADE: itemData?.QUANTIDADE === undefined || itemData?.QUANTIDADE === null ? 1 : itemData.QUANTIDADE,
      };
      updateItemAction(itemIndex, itemPatch);
      // Atualiza também o estado local do valor unitário
      setLocalValorUnit((produto.B1_PRV1 ?? 0).toString());
    },
    [updateItemAction, itemIndex, itemData?.QUANTIDADE]
  );

  // Handler genérico para atualizar o store no blur dos inputs numéricos
  const handleNumericInputBlur = (
    field: "QUANTIDADE" | "VALUNIT",
    localValue: string
  ) => {
    let numericValue = parseFloat(localValue);
    if (isNaN(numericValue) || numericValue < 0) {
      // Se inválido ou negativo, reverte para o valor do store ou um padrão
      numericValue = field === "QUANTIDADE" ? (itemData?.QUANTIDADE ?? 1) : (itemData?.VALUNIT ?? 0);
    }
     // Arredondar para um número razoável de casas decimais se necessário
    if (field === "VALUNIT") {
        numericValue = parseFloat(numericValue.toFixed(4)); // Ex: 4 casas decimais para valor unitário
    }

    // Atualiza o estado local para o valor validado/formatado
    if (field === "QUANTIDADE") setLocalQuantidade(numericValue.toString());
    if (field === "VALUNIT") setLocalValorUnit(numericValue.toString());

    // Atualiza o store
    updateItemAction(itemIndex, { [field]: numericValue });
  };

  if (!itemData) {
    return (
      <TableRow>
        <TableCell colSpan={5} className="text-destructive text-center"> {/* Ajustar colSpan */}
          Erro: Item não encontrado no índice {itemIndex}.
        </TableCell>
      </TableRow>
    );
  }

  // Tenta obter a descrição do produto (assumindo que pode estar no itemData ou precisa ser buscada)
  // Para este exemplo, vamos assumir que o itemData pode ter uma DESC_PROD ou usamos o código.
  const produtoDisplay = itemData.PRODUTO
    ? `${itemData.PRODUTO}`
    : "Selecionar produto";

  return (
    <TableRow className="hover:bg-muted/50 transition-colors">
      <TableCell className="w-[80px] sm:w-[100px] p-2 align-top">
        <Input
          value={itemData.ITEM}
          readOnly
          className="bg-muted/50 border-dashed h-9 text-sm"
          aria-label={`Código do item ${itemData.ITEM}`}
        />
      </TableCell>
      <TableCell className="min-w-[250px] p-2 align-top">
        {/* <Label htmlFor={`item-produto-btn-${itemIndex}`} className="sr-only">Produto</Label> */}
        <Button
          id={`item-produto-btn-${itemIndex}`}
          variant="outline"
          onClick={() => setIsProdutoDialogOpen(true)}
          className="w-full justify-between text-left truncate h-9 text-sm"
        >
          <span className="truncate">{produtoDisplay}</span>
          <PackageSearch className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </TableCell>
      <TableCell className="w-[100px] sm:w-[120px] p-2 align-top">
        {/* <Label htmlFor={`item-qtd-${itemIndex}`} className="sr-only">Quantidade</Label> */}
        <Input
          id={`item-qtd-${itemIndex}`}
          type="number"
          value={localQuantidade}
          onChange={(e) => setLocalQuantidade(e.target.value)}
          onBlur={() => handleNumericInputBlur("QUANTIDADE", localQuantidade)}
          min="0.0001" // Evitar zero se necessário, permitir decimais
          step="any"
          className="h-9 text-sm"
          aria-label="Quantidade do item"
        />
      </TableCell>
      <TableCell className="w-[120px] sm:w-[150px] p-2 align-top">
        {/* <Label htmlFor={`item-valunit-${itemIndex}`} className="sr-only">Valor Unitário</Label> */}
        <Input
          id={`item-valunit-${itemIndex}`}
          type="number"
          value={localValorUnit}
          onChange={(e) => setLocalValorUnit(e.target.value)}
          onBlur={() => handleNumericInputBlur("VALUNIT", localValorUnit)}
          min="0"
          step="any"
          className="h-9 text-sm"
          aria-label="Valor unitário do item"
        />
      </TableCell>
      <TableCell className="w-[60px] p-2 text-right align-top">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemoveItem(itemIndex)}
          aria-label="Remover item"
          className="text-destructive hover:text-destructive-foreground hover:bg-destructive/90 h-9 w-9"
        >
          <XCircle className="h-5 w-5" />
        </Button>
      </TableCell>

      <ProdutoDialog
        open={isProdutoDialogOpen}
        onOpenChange={setIsProdutoDialogOpen}
        onProductSelect={handleProductSelect}
        currentSelectedProductCode={itemData.PRODUTO}
        // initialSearchTerm={itemData.PRODUTO || ""}
      />
    </TableRow>
  );
}
