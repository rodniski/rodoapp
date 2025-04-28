"use client";
import React, { useState, useMemo } from "react";
import {
  Button,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "ui";
import { PackageSearch, Check } from "lucide-react";
import {
  usePreNotaStore,
  usePreNotaAuxStore,
  useFornecedorSearchResult,
} from "@inclusao/stores";
import type { Pedido, Fornecedor } from "@inclusao/api";
import type { PreNotaItem } from "@inclusao/types";

/* ---------- util: sobrescreve dados do pedido SOBRE o item XML ---------- */
const mergeXmlPedido = (xml: PreNotaItem, ped: Pedido): PreNotaItem => ({
  ...xml, // tudo que já estava no XML
  /* somente campos que realmente vêm do pedido -------------------------- */
  PRODUTO: ped.C7_PRODUTO,
  PC: ped.C7_NUM,
  ITEMPC: ped.C7_ITEM,
  QUANTIDADE: ped.C7_QUANT,
  VALUNIT: ped.C7_PRECO,
  TOTAL: ped.C7_TOTAL,
  B1_UM: ped.B1_UM,
  ORIGEM: ped.B1_ORIGEM ?? xml.ORIGEM,
});

/* ---------- estrutura interna para exibir na lista -------------------- */
interface PedidoResumo {
  numero: string;
  total: number;
  qtdItens: number;
  obs: string; //  🆕  campo OBS
  itensOriginais: Pedido[];
}

export function PedidoDialog() {
  const [open, setOpen] = useState(false);

  /* ---------- stores ---------- */
  const header = usePreNotaStore((s) => s.draft.header);
  const xmlItens = usePreNotaStore((s) => s.draft.itens);
  const setItens = usePreNotaStore((s) => s.setItens);
  const setHeader = usePreNotaStore((s) => s.setHeader);

  const setSelectedPedido = usePreNotaAuxStore(
    (s) => s.selection.setSelectedPedido
  );
  const pedidoSelecionado = usePreNotaAuxStore(
    (s) => s.selection.selectedPedido
  );

  const fornecedores = useFornecedorSearchResult();

  /* ---------- lista de pedidos do fornecedor atual -------------------- */
  const pedidosResumo: PedidoResumo[] = useMemo(() => {
    if (!Array.isArray(fornecedores) || fornecedores.length === 0) return [];

    const fornecedorAtual = fornecedores.find(
      (f: Fornecedor) =>
        f.A2_COD === header.FORNECEDOR && f.A2_LOJA === header.LOJA
    );

    if (!fornecedorAtual?.PEDIDOS?.length) return [];

    const agrupados = fornecedorAtual.PEDIDOS.reduce<Record<string, Pedido[]>>(
      (acc, ped) => {
        (acc[ped.C7_NUM] ||= []).push(ped);
        return acc;
      },
      {}
    );

    return Object.entries(agrupados).map(([numero, itens]) => ({
      numero,
      total: itens.reduce((s, i) => s + (i.C7_TOTAL || 0), 0),
      qtdItens: itens.length,
      obs: itens[0]?.OBS ?? "", //  🆕  pega OBS do 1º item
      itensOriginais: itens,
    }));
  }, [fornecedores, header.FORNECEDOR, header.LOJA]);

  const buttonLabel = pedidoSelecionado?.C7_NUM ?? "Selecionar pedido";

  /* ---------- quando o usuário escolhe um pedido ---------------------- */
  const handleSelectPedido = (pedResumo: PedidoResumo) => {
    /* 1. guarda referência ao pedido escolhido ------------------------- */
    setSelectedPedido(pedResumo.itensOriginais[0]);

    /* 2. grava CONDFIN no header (usa C7_COND do 1º item) -------------- */
    const condicao = pedResumo.itensOriginais[0]?.C7_COND ?? "";
    setHeader({ CONDFIN: condicao });

    /* 3. faz merge item-a-item ---------------------------------------- */
    const novosItens: PreNotaItem[] = xmlItens.map((xmlIt) => {
      const ped = pedResumo.itensOriginais.find(
        (p) => p.C7_ITEM === xmlIt.ITEM || p.C7_ITEM === xmlIt.ITEMPC
      );
      return ped ? mergeXmlPedido(xmlIt, ped) : xmlIt;
    });

    setItens(novosItens);
    setOpen(false);
  };

  /* ---------- UI ------------------------------------------------------ */
  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => setOpen(true)}
        disabled={!header.FORNECEDOR}
        title={
          !header.FORNECEDOR ? "Selecione um fornecedor primeiro" : buttonLabel
        }
      >
        <span className="truncate">{buttonLabel}</span>
        <PackageSearch className="h-4 w-4 opacity-60" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar número do pedido..." />
        <CommandList>
          {pedidosResumo.length ? (
            <CommandGroup
              heading={`Pedidos para ${header.FORNECEDOR}/${header.LOJA}`}
            >
              {pedidosResumo.map((p) => (
                <CommandItem
                  key={p.numero}
                  value={p.numero}
                  onSelect={() => handleSelectPedido(p)}
                  className="flex flex-col items-start cursor-pointer"
                >
                  <div className="justify-between items-center w-full flex">
                    <span className="font-medium">Pedido: {p.numero}</span>
                    <span className="text-xs">
                      Total:&nbsp;
                      {p.total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                  <div className="w-full flex justify-between text-xs text-muted-foreground">
                    {p.obs && (
                      <span className="text-xs mt-0.5 italic text-muted-foreground">
                        OBS: {p.obs}
                      </span>
                    )}
                    <span>Itens: {p.qtdItens}</span>
                  </div>

                  {pedidoSelecionado?.C7_NUM === p.numero && (
                    <Check className="absolute right-2 top-1/2 -translate-y-1/2 text-primary h-4 w-4" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <CommandEmpty>
              {header.FORNECEDOR
                ? "Nenhum pedido encontrado para este fornecedor."
                : "Selecione primeiro um fornecedor."}
            </CommandEmpty>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
