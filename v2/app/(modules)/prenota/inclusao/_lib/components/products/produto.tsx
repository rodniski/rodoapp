"use client";
import React, { useCallback, useMemo, useState } from "react";
import {
  usePreNotaStore,
  usePreNotaAuxStore,
  useFornecedorSearchResult,
} from "@inclusao/stores";
import { Combobox, ComboboxItem } from "ui";
import { UnitMismatchModal } from "./UnitMismatchModal";
import type { Pedido } from "@inclusao/api";
import type { PreNotaItem } from "@inclusao/types";

interface ProdutoComboboxProps {
  selectedValue: string | null;
  xmlItem: PreNotaItem;            // agora é o item da tabela (contém ITEM, PRODFOR, DESCFOR…)
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
  /* ---------- stores ---------- */
  const setItens         = usePreNotaStore((s) => s.setItens);
  const prevItens        = usePreNotaStore.getState().draft.itens;
  const selectedPedido   = usePreNotaAuxStore((s) => s.selection.selectedPedido);
  const fornecedores     = useFornecedorSearchResult();

  /* ---------- lista de produtos do pedido selecionado ---------- */
  const itensDoPedido = useMemo(() => {
    if (!selectedPedido) return [];
    const pedidoNum = selectedPedido.C7_NUM;
    const fornecedor = fornecedores?.find((f) =>
      f.PEDIDOS?.some((p) => p.C7_NUM === pedidoNum)
    );
    return fornecedor?.PEDIDOS?.filter((p) => p.C7_NUM === pedidoNum) ?? [];
  }, [selectedPedido, fornecedores]);

  /* ---------- combobox items ---------- */
  const items: CustomComboboxItemProps[] = useMemo(
    () =>
      itensDoPedido.map((p) => ({
        value : `${p.C7_PRODUTO}-${p.C7_ITEM}-${p.C7_QUANT}`,
        label : `${p.C7_ITEM} - ${p.B1_DESC}`,
        itempc: p.C7_ITEM,
        cod   : p.C7_PRODUTO,
        pedido: p.C7_NUM,
        saldo : p.C7_QUANT,
      })),
    [itensDoPedido]
  );

  /* ---------- modal de divergência ---------- */
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingProduto, setPendingProduto] = useState<Pedido | null>(null); // guarda o item do pedido p/ usar no modal
  const [localSelected, setLocalSelected] = useState<string | null>(selectedValue ?? null);

  /* ---------- grava item (com quantidade vinda do modal ou do pedido) ---------- */
  const gravarItem = (prod: Pedido, quantidade: number) => {
    const itemId = xmlItem.ITEM;           // mesmo ID da linha
    const newItem: PreNotaItem = {
      ...xmlItem,                          // mantém absolutamente tudo que já veio do XML
      PRODUTO  : prod.C7_PRODUTO,
      PC       : prod.C7_NUM,
      ITEMPC   : prod.C7_ITEM,
      QUANTIDADE: quantidade,
      VALUNIT  : prod.C7_PRECO,
      TOTAL    : prod.C7_PRECO * quantidade, // opcional: recalcular total
      B1_UM    : prod.B1_UM,
      ORIGEM   : prod.B1_ORIGEM,
      selectedProduto: `${prod.C7_PRODUTO}-${prod.C7_ITEM}-${prod.C7_QUANT}`,
    };

    const updated =
      prevItens.some((i) => i.ITEM === itemId)
        ? prevItens.map((i) => (i.ITEM === itemId ? newItem : i))
        : [...prevItens, newItem];

    setItens(updated);
    setLocalSelected(newItem.selectedProduto ?? null);
  };

  /* ---------- seleção no combobox ---------- */
  const handleSelect = useCallback(
    (value: string | null) => {
      // remove o vínculo se usuário limpar
      if (!value) {
        setItens(prevItens.filter((i) => i.ITEM !== xmlItem.ITEM));
        setLocalSelected(null);
        return;
      }

      const prod = itensDoPedido.find(
        (p) => `${p.C7_PRODUTO}-${p.C7_ITEM}-${p.C7_QUANT}` === value
      );
      if (!prod) return;

      // unidade diverge?
      if ((xmlItem.B1_UM || "").toUpperCase() !== (prod.B1_UM || "").toUpperCase()) {
        setPendingProduto(prod);
        setModalOpen(true);
      } else {
        gravarItem(prod, prod.C7_QUANT);
      }
    },
    [itensDoPedido, xmlItem, setItens]
  );

  /* ---------- confirma modal ---------- */
  const handleModalConfirm = (novaQtd: number) => {
    if (pendingProduto) gravarItem(pendingProduto, novaQtd);
    setPendingProduto(null);
  };

  return (
    <>
      <Combobox
        items={items}
        placeholder="Selecione produto do pedido"
        selectedValue={localSelected}
        onSelect={handleSelect}
        itemRender={(it) => (
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              {it.cod} – Saldo: {it.saldo} – Pedido: {it.pedido}
            </span>
            <span>{it.label}</span>
          </div>
        )}
        renderSelected={(it) => (
          <div className="flex flex-col">
            <span className="text-xs">Pedido: {it.pedido}</span>
            <span className="text-sm">{it.label}</span>
          </div>
        )}
      />

      {pendingProduto && (
        <UnitMismatchModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          unidadeXml={xmlItem.B1_UM}
          unidadePedido={pendingProduto.B1_UM}
          quantidadePedido={pendingProduto.C7_QUANT}
          onConfirm={handleModalConfirm}
        />
      )}
    </>
  );
};
