// _lib/components/products/ProdutoSelectionCell.tsx (NOVO ARQUIVO)
"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, Command, CommandInput, CommandEmpty, CommandList, CommandGroup, CommandItem, ScrollArea } from "ui"; // Importe componentes de UI necessários
import { Link2, Check, Search } from "lucide-react"; // Ícones
import {
  usePreNotaStore,
  usePreNotaAuxStore,
  useFornecedorSearchResult,
} from "@inclusao/stores";
import type { Pedido } from "@inclusao/api";
import type { PreNotaItem } from "@inclusao/types";
import { cn, formatCurrency } from "utils"; // Função utilitária para classes
import { QuantityConfirmationModal } from ".";

// Props que a célula recebe da tabela
interface ProdutoSelectionCellProps {
  xmlItem: PreNotaItem; // O item completo da linha atual (vindo do XML/digitado)
}

// Tipo para os itens do Command (derivado do Pedido)
interface ProdutoCommandItem extends Pedido {
    value: string; // Valor único para seleção no Command
    label: string; // Label a ser exibido
}

export const ProdutoSelectionCell: React.FC<ProdutoSelectionCellProps> = ({ xmlItem }) => {
  /* ---------- Estados Locais ---------- */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingProduto, setPendingProduto] = useState<Pedido | null>(null);

  /* ---------- Stores ---------- */
  const setItens = usePreNotaStore((s) => s.setItens);
  const getDraftItens = usePreNotaStore((s) => s.draft.itens); // Pega a função getter para estado atual
  const selectedPedido = usePreNotaAuxStore((s) => s.selection.selectedPedido);
  const fornecedores = useFornecedorSearchResult(); // Usado para encontrar o pedido

  /* ---------- Calcula Itens do Pedido Disponíveis (igual ao combobox) ---------- */
  const itensDoPedido = useMemo(() => {
    if (!selectedPedido) return [];
    const pedidoNum = selectedPedido.C7_NUM;
    const fornecedor = fornecedores?.find((f) => f.PEDIDOS?.some((p) => p.C7_NUM === pedidoNum));
    return fornecedor?.PEDIDOS?.filter((p) => p.C7_NUM === pedidoNum) ?? [];
  }, [selectedPedido, fornecedores]);

  /* ---------- Formata Itens para o Command ---------- */
   const commandItems: ProdutoCommandItem[] = useMemo(
    () =>
      itensDoPedido.map((p) => ({
        ...p, // Inclui todos os dados do Pedido
        // Cria um valor único e um label para o Command
        value: `${p.C7_PRODUTO}-${p.C7_ITEM}-${p.C7_NUM}`, // Garante unicidade com Pedido
        label: `${p.C7_PRODUTO} - ${p.B1_DESC ?? 'S/ Descrição'} (Item Ped: ${p.C7_ITEM})`,
      })),
    [itensDoPedido]
  );

  /* ---------- Função para Gravar Item (igual ao combobox, mas pega prevItens na hora) ---------- */
  const gravarItem = (prod: Pedido, quantidade: number) => {
    const prevItens = getDraftItens; // Pega o estado MAIS ATUAL dos itens
    const itemId = xmlItem.ITEM;

    // Adiciona B1_DESC ao PreNotaItem para exibição posterior na tabela
    const newItem: PreNotaItem & { B1_DESC?: string } = { // Pode precisar ajustar o tipo PreNotaItem globalmente
      ...xmlItem,
      PRODUTO: prod.C7_PRODUTO,
      PC: prod.C7_NUM,
      ITEMPC: prod.C7_ITEM,
      B1_UM: prod.B1_UM,
      ORIGEM: prod.B1_ORIGEM, // Certifique-se que B1_ORIGEM existe e tem o tipo correto
      QUANTIDADE: quantidade,
      VALUNIT: prod.C7_PRECO, // Considerar se o VALUNIT deve vir do XML ou Pedido
      TOTAL: prod.C7_PRECO * quantidade, // Recalcular Total
      B1_DESC: prod.B1_DESC, // Armazena a descrição do Protheus
    };

    const updated =
      prevItens.some((i) => i.ITEM === itemId)
        ? prevItens.map((i) => (i.ITEM === itemId ? newItem : i))
        : [...prevItens, newItem];

    setItens(updated); // Atualiza o store
    setDialogOpen(false); // Fecha o dialog após gravar
  };

  /* ---------- Seleção no Command Dialog ---------- */
  const handleSelect = useCallback(
    (selectedValue: string) => {
      const selectedCommandItem = commandItems.find(item => item.value === selectedValue);
      if (!selectedCommandItem) return;

      // Pega o objeto Pedido original de dentro do command item
      const prod: Pedido = selectedCommandItem;

      // Lógica de divergência de unidade (igual ao combobox)
      if ((xmlItem.B1_UM || "").toUpperCase() !== (prod.B1_UM || "").toUpperCase()) {
        setPendingProduto(prod);
        setModalOpen(true);
        // Dialog principal pode ou não fechar aqui, talvez manter aberto?
        // setDialogOpen(false); // Ou manter aberto e fechar só no modal
      } else {
        gravarItem(prod, prod.C7_QUANT); // Usa quantidade do pedido se unidade bate
        setDialogOpen(false); // Fecha o dialog
      }
    },
    [commandItems, xmlItem, gravarItem] // Adicionado gravarItem como dependência
  );

  /* ---------- Confirmação do Modal de Divergência ---------- */
  const handleModalConfirm = (novaQtd: number) => {
    if (pendingProduto) {
        gravarItem(pendingProduto, novaQtd); // Grava com a quantidade informada
    }
    setPendingProduto(null);
    setModalOpen(false); // Fecha o modal
    setDialogOpen(false); // Garante que o dialog principal também feche
  };

  // Determina se já existe um produto vinculado para esta linha
  const isLinked = Boolean(xmlItem.PRODUTO);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant={isLinked ? "ghost" : "outline"} // Muda aparência se já vinculado
            size="sm"
            className={cn(
                "h-7 px-2", // Tamanho menor
                isLinked ? "text-green-600 hover:text-green-700" : "text-blue-600 hover:text-blue-700"
            )}
            title={isLinked ? "Produto Vinculado (Clique para alterar)" : "Vincular Produto do Pedido"}
          >
            {isLinked
                ? <Check className="h-4 w-4" />
                : <Link2 className="h-4 w-4" />
             }
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]"> {/* Ajuste largura do dialog */}
          <DialogHeader>
            <DialogTitle>Vincular Produto do Pedido</DialogTitle>
            <div className="text-sm text-muted-foreground pt-1">
                <span>Item XML: {xmlItem.ITEM} - {xmlItem.DESCFOR} ({xmlItem.PRODFOR})</span><br/>
                <span>Pedido: {selectedPedido?.C7_NUM}</span>
            </div>
          </DialogHeader>
          <Command className="rounded-lg border shadow-md">
            <CommandInput placeholder="Buscar Código ou Descrição do Produto..." />
            <CommandList>
                <ScrollArea className="h-[300px]"> {/* Scroll se muitos itens */}
                    <CommandEmpty>Nenhum produto encontrado no pedido selecionado.</CommandEmpty>
                    <CommandGroup>
                    {commandItems.map((item) => (
                        <CommandItem
                        key={item.value}
                        value={item.label} // Valor usado para busca no CommandInput
                        onSelect={() => handleSelect(item.value)} // Chama handleSelect com o valor único
                        className="cursor-pointer"
                        >
                            <div className="flex justify-between w-full items-center">
                                <div className="flex flex-col">
                                    <span className="font-medium">{item.label}</span>
                                    <span className="text-xs text-muted-foreground">
                                        Saldo: {item.C7_QUANT ?? '?'} {item.B1_UM} -
                                        Preço: {formatCurrency(item.C7_PRECO)} -
                                        Item PC: {item.C7_ITEM}
                                    </span>
                                </div>
                                {/* Opcional: Mostrar um check se este item já está selecionado */}
                                {/* <Check className={cn("h-4 w-4", xmlItem.PRODUTO === item.C7_PRODUTO ? "opacity-100" : "opacity-0")} /> */}
                            </div>
                        </CommandItem>
                    ))}
                    </CommandGroup>
                </ScrollArea>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      {/* Modal de Divergência (renderizado quando necessário) */}
      {pendingProduto && (
        <QuantityConfirmationModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          unidadeXml={xmlItem.B1_UM}
          unidadePedido={pendingProduto.B1_UM}
          quantidadeXml={xmlItem.QUANTIDADE}
          quantidadePedido={pendingProduto.C7_QUANT}
          onConfirm={handleModalConfirm}
        />
      )}
    </>
  );
};
