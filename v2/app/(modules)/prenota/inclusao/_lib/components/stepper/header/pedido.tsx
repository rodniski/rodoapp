// PedidoDialog.tsx
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
  useSelectedPedidoNumero,
} from "@inclusao/stores";
// Corrigindo imports de tipos (assumindo que estão em @inclusao/types)
import type { PreNotaItem } from "@inclusao/types"; // Adicionado Fornecedor aqui
import type { Pedido, Fornecedor } from "@inclusao/api";
// Interface para o resumo do pedido (mantida)
interface PedidoResumo {
  numero: string;
  total: number;
  qtdItens: number;
  itensOriginais: Pedido[];
}

export function PedidoDialog() {
  const [open, setOpen] = useState(false);

  // Seletores do Store Principal
  const fornecedorCod = usePreNotaStore((s) => s.draft.header.FORNECEDOR); // Este é o CNPJ (ou código, dependendo do que setHeader salvou)
  const fornecedorLoja = usePreNotaStore((s) => s.draft.header.LOJA);
  const setItens = usePreNotaStore((s) => s.setItens); // Ação

  // Seletores/Ações do Store Auxiliar
  const fornecedorSearchResult = useFornecedorSearchResult(); // Lista Fornecedor[] com PEDIDOS
  const pedidoSelecionado = useSelectedPedidoNumero();
  const { setSelectedPedidoNumero } = usePreNotaAuxStore.getState().selection;

  // Deriva a lista de pedidos resumidos para o fornecedor selecionado
  const pedidosResumo = useMemo((): PedidoResumo[] => {
    // --- CORREÇÃO AQUI ---
    // Encontra o fornecedor no resultado da busca comparando o campo correto.
    // Se 'fornecedorCod' guarda o CNPJ, comparamos com A2_CGC.
    // Se 'fornecedorCod' guarda o A2_COD, mantenha a comparação com A2_COD.
    // Assumindo que fornecedorCod (vindo de FORNECEDOR no header) é o CNPJ:
    const fornecedorAtual = fornecedorSearchResult?.find(
      (f: Fornecedor) => f.A2_CGC === fornecedorCod && f.A2_LOJA === fornecedorLoja // <-- Comparar com A2_CGC (CNPJ)
      // Ou, se FORNECEDOR no header guarda o A2_COD:
      // (f: Fornecedor) => f.A2_COD === fornecedorCod && f.A2_LOJA === fornecedorLoja
    );
    // --- FIM DA CORREÇÃO ---

    if (!fornecedorAtual?.PEDIDOS) return [];

    const pedidosAgrupados = fornecedorAtual.PEDIDOS.reduce<Record<string, Pedido[]>>(
        (acc, itemPedido) => {
            const numPedido = itemPedido.C7_NUM;
            acc[numPedido] = acc[numPedido] || [];
            acc[numPedido].push(itemPedido);
            return acc;
        }, {}
    );
    return Object.entries(pedidosAgrupados).map(([numero, itens]) => ({
      numero: numero,
      total: itens.reduce((sum, item) => sum + (item.C7_TOTAL || 0), 0),
      qtdItens: itens.length,
      itensOriginais: itens,
    }));
  }, [fornecedorSearchResult, fornecedorCod, fornecedorLoja]); // Dependências corretas

  // Label do botão (mantido)
  const buttonLabel = pedidoSelecionado || "Selecionar pedido";

  // Função de seleção (tipo PreNotaItem corrigido)
  const handleSelectPedido = (pedidoSelecionadoResumo: PedidoResumo) => {
    // ... (lógica interna mantida, tipo PreNotaItem usado) ...
    console.log("Pedido Selecionado:", pedidoSelecionadoResumo);
    setSelectedPedidoNumero(pedidoSelecionadoResumo.numero);

    const mappedItens: PreNotaItem[] = pedidoSelecionadoResumo.itensOriginais.map(
      (itemPedido, index): PreNotaItem => {
        const baseItem: PreNotaItem = {
          ITEM: String(index + 1).padStart(4, "0"),
          PRODUTO: itemPedido.C7_PRODUTO || "",
          QUANTIDADE: itemPedido.C7_QUANT || 0,
          VALUNIT: itemPedido.C7_PRECO || 0,
          PRODFOR: "",
          DESCFOR: itemPedido.B1_DESC || "",
          ORIGEMXML: "",
          TOTAL: itemPedido.C7_TOTAL || 0,
          PC: itemPedido.C7_NUM || "",
          ITEMPC: itemPedido.C7_ITEM || "",
          B1_UM: itemPedido.B1_UM || "",
          ORIGEM: itemPedido.B1_ORIGEM || "",
        };
        Object.keys(baseItem).forEach(
            (key) => baseItem[key as keyof PreNotaItem] === undefined && delete baseItem[key as keyof PreNotaItem]
        );
        return baseItem;
      }
    );
    setItens(mappedItens);
    console.log(`Itens da PreNota atualizados com ${mappedItens.length} itens do pedido ${pedidoSelecionadoResumo.numero}.`);
    setOpen(false);
  };

  const isButtonDisabled = !fornecedorCod;

  // Renderização JSX (sem alterações na lógica)
  return (
    <>
      {/* Botão e Diálogo ... */}
       <Button
        type="button"
        variant="outline"
        className="w-full justify-between"
        onClick={() => setOpen(true)}
        disabled={isButtonDisabled}
        title={isButtonDisabled ? "Selecione um fornecedor primeiro" : buttonLabel}
      >
        <span className="truncate">{buttonLabel}</span>
        <PackageSearch className="h-4 w-4 opacity-60" />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar número do pedido..." />
        <CommandList>
          {pedidosResumo.length > 0 ? (
            <CommandGroup heading={`Pedidos para Fornecedor ${fornecedorCod}/${fornecedorLoja}`}>
              {pedidosResumo.map((p) => (
                <CommandItem
                  key={p.numero}
                  onSelect={() => handleSelectPedido(p)}
                  value={p.numero}
                  className="flex flex-col items-start cursor-pointer"
                >
                  <span className="font-medium">Pedido: {p.numero}</span>
                  <div className="w-full flex justify-between text-xs text-muted-foreground">
                      <span>Total: {p.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL",})}</span>
                      <span>Itens: {p.qtdItens}</span>
                  </div>
                   {pedidoSelecionado === p.numero && (
                        <Check className="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2 text-primary" />
                     )}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <CommandEmpty>
                {fornecedorCod ? `Nenhum pedido encontrado para o fornecedor ${fornecedorCod}/${fornecedorLoja}.` : "Selecione um fornecedor."}
            </CommandEmpty>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}