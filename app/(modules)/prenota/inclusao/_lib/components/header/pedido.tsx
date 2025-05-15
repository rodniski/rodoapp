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
  Badge,
} from "ui";
import { PackageSearch } from "lucide-react";
import {
  usePreNotaStore,
  useFornecedorSearchResult,
  usePedidosSelecionadosAux,
  useAddPedidoSelecionadoAux,
  useRemovePedidoSelecionadoAux,
  usePreNotaAuxStore,
} from "@inclusao/stores";
import type { Pedido, Fornecedor } from "@inclusao/api";

interface PedidoResumo {
  numero: string;
  total: number;
  qtdItens: number;
  obs: string;
  itensOriginais: Pedido[];
}

interface PedidoDialogProps {
  value?: string;
  onChange: (numeroPedido: string, condicao: string) => void;
}

export function PedidoDialog({ value, onChange }: PedidoDialogProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const header = usePreNotaStore((s) => s.draft.header);
  const fornecedores = useFornecedorSearchResult();
  const pedidosSelecionados = usePedidosSelecionadosAux();
  const addPedidoSelecionado = useAddPedidoSelecionadoAux();
  const removePedidoSelecionado = useRemovePedidoSelecionadoAux();
  const setSelectedPedido = usePreNotaAuxStore(
    (s) => s.selection.setSelectedPedido
  );

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

    const todos = Object.entries(agrupados).map(([numero, itens]) => ({
      numero,
      total: itens.reduce((s, i) => s + (i.C7_TOTAL || 0), 0),
      qtdItens: itens.length,
      obs: itens[0]?.OBS ?? "",
      itensOriginais: itens,
    }));

    return todos.filter((p) => p.numero.includes(filter));
  }, [fornecedores, header.FORNECEDOR, header.LOJA, filter]);

  const buttonLabel = pedidosSelecionados.pedidosSelecionados.length
    ? ""
    : "Selecionar pedido";

  const handleTogglePedido = (pedido: PedidoResumo) => {
    if (pedidosSelecionados.pedidosSelecionados.includes(pedido.numero)) {
      removePedidoSelecionado(pedido.numero);
    } else {
      addPedidoSelecionado(pedido.numero);
    }
  };
  const handleConfirmarSelecao = () => {
    if (pedidosSelecionados.pedidosSelecionados.length > 0) {
      const primeiroPedido = pedidosResumo.find(
        (p) => p.numero === pedidosSelecionados.pedidosSelecionados[0]
      );
      if (primeiroPedido) {
        const pedidoSelecionado = primeiroPedido.itensOriginais[0];
        
        // Atualiza na store auxiliar
        setSelectedPedido(pedidoSelecionado);
  
        // Atualiza no header da pré-nota
        usePreNotaStore.getState().setHeader({
          CONDFIN: pedidoSelecionado.C7_COND || "",
        });
  
        // Atualiza via callback do formulário (opcional se for redundante)
        onChange(
          pedidoSelecionado.C7_NUM,
          pedidoSelecionado.C7_COND || ""
        );
      }
    }
    setOpen(false);
  };

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
        <span className="truncate flex gap-2 items-center">
          {buttonLabel}
          {pedidosSelecionados.pedidosSelecionados.map((num) => (
            <Badge key={num} variant="default">
              {num}
            </Badge>
          ))}
        </span>
        <PackageSearch className="h-4 w-4 opacity-60" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Buscar número do pedido..."
          value={filter}
          onValueChange={(value) => setFilter(value)}
        />
        <CommandList>
          {pedidosResumo.length ? (
            <CommandGroup
              heading={`Pedidos para ${header.FORNECEDOR}/${header.LOJA}`}
            >
              {pedidosResumo.map((p) => (
                <CommandItem
                  key={p.numero}
                  value={p.numero}
                  onSelect={() => handleTogglePedido(p)}
                  className={`flex flex-col items-start cursor-pointer my-1 ${
                    pedidosSelecionados.pedidosSelecionados.includes(p.numero)
                      ? "bg-primary text-white"
                      : ""
                  }`}
                >
                  <div className="justify-between items-center w-full flex">
                    <span className="font-medium">Pedido: {p.numero}</span>
                    <span className="text-xs">
                      Total:{" "}
                      {p.total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                  <div className="w-full flex justify-between text-xs">
                    {p.obs && (
                      <span className="mt-0.5 italic">OBS: {p.obs}</span>
                    )}
                    <span className="mt-0.5 italic">Itens: {p.qtdItens}</span>
                  </div>
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
        <div className="p-3 flex justify-end">
          <Button onClick={handleConfirmarSelecao}>Confirmar Seleção</Button>
        </div>
      </CommandDialog>
    </>
  );
}
