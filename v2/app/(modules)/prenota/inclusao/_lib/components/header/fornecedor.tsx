"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from "ui"; // Seus componentes UI (ex: shadcn/ui)
import { Loader2, Users, Check } from "lucide-react";
import { useSearchFornecedorPedidos } from "@inclusao/hooks"; // Hook para buscar fornecedor/pedidos
import { formatCNPJ } from "utils"; // Utilitário de formatação (ajuste path se necessário)
import {
  usePreNotaStore, // Store principal da pré-nota
  usePreNotaAuxStore, // Store auxiliar geral
  useXmlDataLoadedStatus, // Seletor para flag XML carregado
  useFornecedorSearchResult, // Seletor para resultado da busca de fornecedor
  useSelectedFornecedor, // Seletor para fornecedor selecionado (com nome)
} from "@inclusao/stores"; // Stores (usando aliases)
// --- Tipos Importantes ---
// Importa Fornecedor (que contém Pedido[]) da definição da API ou de types se movido
import type { Fornecedor, Pedido } from "@inclusao/api";
// Importa PreNotaItem da definição de tipos da inclusão/prenota
import type { PreNotaItem } from "@inclusao/types";

// Estrutura interna para as opções formatadas exibidas na lista
interface FormattedOption {
  uniqueId: string; // Combinação de código e loja
  cod: string; // Código ou CNPJ do fornecedor
  loja: string;
  desc: string; // Nome formatado para exibição
  cnpj: string; // CNPJ original para exibição formatada
  original: Fornecedor; // Objeto Fornecedor original com todos os dados (incluindo PEDIDOS)
}

export function FornecedorDialog() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState(""); // Termo de busca digitado no input

  // --- Hooks e Stores ---
  // Hook para realizar a busca
  const {
    searchFornecedor,
    isLoading,
    error: searchError,
  } = useSearchFornecedorPedidos();
  // Lê resultados e estados dos stores auxiliares
  const searchResult = useFornecedorSearchResult();
  const xmlFoiCarregado = useXmlDataLoadedStatus();
  const selectedFornecedorInfo = useSelectedFornecedor(); // Lê { cod, loja, nome } do fornecedor selecionado
  // Lê estados e ações do store principal (seletores individuais para evitar loops)
  const currentHeader = usePreNotaStore((state) => state.draft.header);
  const setHeader = usePreNotaStore((state) => state.setHeader);
  const setItens = usePreNotaStore((state) => state.setItens);
  const isXmlMode = usePreNotaStore((state) => state.mode === "xml");
  // Pega ação para definir o fornecedor selecionado no store auxiliar
  const { setSelectedFornecedor } = usePreNotaAuxStore.getState().selection;

  // --- Memos para dados derivados ---

  // Formata o resultado da busca (Fornecedor[]) para as opções do CommandList
// …FornecedorDialog.tsx
const options = useMemo((): FormattedOption[] => {
  if (!Array.isArray(searchResult) || searchResult.length === 0) return [];

  return searchResult.map((forn) => ({
    uniqueId: `${forn.A2_COD}-${forn.A2_LOJA}`,
    cod     : forn.A2_COD,
    loja    : forn.A2_LOJA,
    desc    : forn.A2_NOME || forn.A2_NREDUZ || `Cod: ${forn.A2_COD} / Loja: ${forn.A2_LOJA}`,
    cnpj    : forn.A2_CGC,
    original: forn,
  }));
}, [searchResult]);


  // Define o texto do botão principal
  const buttonLabel = useMemo(() => {
    // Prioridade 1: Nome do fornecedor selecionado (vindo do store auxiliar)
    // Verifica se corresponde ao header principal para consistência
    if (
      selectedFornecedorInfo &&
      selectedFornecedorInfo.A2_COD === currentHeader.FORNECEDOR &&
      selectedFornecedorInfo.A2_LOJA === currentHeader.LOJA &&
      selectedFornecedorInfo.A2_NOME
    ) {
      return selectedFornecedorInfo.A2_NOME;
    }
    // Prioridade 2: Código/Loja do header principal (se nenhum nome correspondente for encontrado no aux)
    if (currentHeader.FORNECEDOR && currentHeader.LOJA) {
      return `Cod: ${currentHeader.FORNECEDOR} / Loja: ${currentHeader.LOJA}`;
    }
    // Default
    return "Selecionar fornecedor";
  }, [selectedFornecedorInfo, currentHeader.FORNECEDOR, currentHeader.LOJA]); // Depende do aux e do header

  // --- Handlers ---

  // Chamado quando um fornecedor é selecionado na lista do diálogo
  const handleSelectSupplier = (selectedOption: FormattedOption) => {
    console.log("Fornecedor Selecionado Manualmente:", selectedOption);

    setHeader({
      FORNECEDOR: selectedOption.original.A2_COD, // <- agora garantido
      LOJA: selectedOption.original.A2_LOJA, // <- agora garantido
    });

    // Salvando no formato original do Store (Fornecedor completo, mas sem PEDIDOS)
    const { PEDIDOS, ...fornecedorSemPedidos } = selectedOption.original;

    setSelectedFornecedor(fornecedorSemPedidos);

    if (!xmlFoiCarregado && PEDIDOS.length > 0) {
      console.log("XML não carregado, populando itens a partir dos pedidos...");
      const mappedItens: PreNotaItem[] = PEDIDOS.map((itemPedido, index) => ({
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
      }));

      setItens(mappedItens);
      console.log(
        `Itens da PreNota populados com ${mappedItens.length} itens.`
      );
    } else {
      console.log("Itens não populados (XML já carregado ou sem pedidos).");
      setItens([]);
    }

    setOpen(false);
    setTerm("");
  };



  // -- depois --
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

   // se já temos resultados, confirma o primeiro com Enter
   if (options.length > 0) {
     handleSelectSupplier(options[0]);
     return;
   }

    // caso contrário, dispara a busca
    if (term.trim()) {
      searchFornecedor({ busca: term.trim()});
    }
  };

  // Atualiza o termo de busca local ao digitar
  const handleInputChange = (value: string) => {
    setTerm(value);
  };

  // --- Renderização ---
  return (
    <>
      {/* Botão que abre o diálogo */}
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between"
        onClick={() => !isXmlMode && setOpen(true)} // Só abre se não for modo XML
        disabled={isXmlMode} // Desabilitado em modo XML
        title={isXmlMode ? "Seleção desabilitada em modo XML" : buttonLabel}
      >
        <span className="truncate">{buttonLabel}</span>
        <Users className="h-4 w-4 opacity-60" />
      </Button>

      {/* Diálogo de Busca/Seleção */}
      <CommandDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setTerm(""); // Limpa o termo ao fechar
            // Limpar resultado da busca ao fechar? Opcional.
            // usePreNotaAuxStore.getState().fornecedorSearch.clearSearchResult();
          }
        }}
      >
        {/* Usamos um div wrapper para garantir que o scroll funcione corretamente */}
        <div>
          <CommandInput
            autoFocus
            placeholder="Buscar fornecedor por nome ou CNPJ (pressione Enter)"
            value={term}
            onValueChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          {/* A lista de comandos com scroll interno */}
          <CommandList data-slot="command-list">
            {/* Mensagem de Erro */}
            {searchError && (
              <div className="py-4 px-4 text-center text-sm text-destructive">
                Erro ao buscar: {searchError}
              </div>
            )}
            {/* Indicador de Loading */}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando...
              </div>
            )}
            {/* Lista de Resultados */}
            {!isLoading && !searchError && options.length > 0 && (
              <CommandGroup heading="Resultados da Busca">
                {options.map((opt) => (
                  <CommandItem
                    key={opt.uniqueId}
                    onSelect={() => handleSelectSupplier(opt)}
                    value={`${opt.desc} ${opt.cod} ${opt.cnpj}`} // Valor para busca interna do Command
                    className="flex flex-col items-start cursor-pointer"
                  >
                    <span className="font-medium">{opt.desc}</span>
                    <div className="w-full flex justify-between text-xs text-muted-foreground">
                      <span>CNPJ: {formatCNPJ(opt.cnpj)}</span>
                      <span>
                        Cod: {opt.cod} / Loja: {opt.loja}
                      </span>
                    </div>
                    {/* Check para indicar fornecedor atualmente selecionado */}
                    {currentHeader.FORNECEDOR === opt.cod &&
                      currentHeader.LOJA === opt.loja && (
                        <Check className="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2 text-primary" />
                      )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {/* Mensagem de Lista Vazia */}
            {!isLoading && !searchError && options.length === 0 && (
              <CommandEmpty>
                {term.trim() // Mostra mensagem diferente se já houve busca
                  ? "Nenhum fornecedor encontrado."
                  : "Digite e pressione Enter para buscar..."}
              </CommandEmpty>
            )}
          </CommandList>
        </div>
      </CommandDialog>
    </>
  );
}
