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
  // novo estado para controlar o valor de busca
  const [filter, setFilter] = useState("");

  const header = usePreNotaStore((s) => s.draft.header);
  const fornecedores = useFornecedorSearchResult();
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

    // cria o resumo completo
    const todos = Object.entries(agrupados).map(([numero, itens]) => ({
      numero,
      total: itens.reduce((s, i) => s + (i.C7_TOTAL || 0), 0),
      qtdItens: itens.length,
      obs: itens[0]?.OBS ?? "",
      itensOriginais: itens,
    }));

    // filtra pelo número do pedido conforme digitado
    return todos.filter((p) => p.numero.includes(filter));
  }, [fornecedores, header.FORNECEDOR, header.LOJA, filter]);

  const buttonLabel = value ?? "Selecionar pedido";

  const handleSelectPedido = (pedResumo: PedidoResumo) => {
    setSelectedPedido(pedResumo.itensOriginais[0]);
    const condicao = pedResumo.itensOriginais[0]?.C7_COND ?? "";

    // Aqui chamamos o onChange que atualiza no componente pai
    onChange(pedResumo.numero, condicao);

    // limpa filtro ao fechar
    setFilter("");
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
        <span className="truncate">{buttonLabel}</span>
        <PackageSearch className="h-4 w-4 opacity-60" />
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        {/* adiciona value e onValueChange para controlar a busca */}
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
                  onSelect={() => handleSelectPedido(p)}
                  className="flex flex-col items-start cursor-pointer"
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
                  <div className="w-full flex justify-between text-xs text-muted-foreground">
                    {p.obs && (
                      <span className="text-xs mt-0.5 italic text-muted-foreground">
                        OBS: {p.obs}
                      </span>
                    )}
                    <span>Itens: {p.qtdItens}</span>
                  </div>

                  {value === p.numero && (
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
