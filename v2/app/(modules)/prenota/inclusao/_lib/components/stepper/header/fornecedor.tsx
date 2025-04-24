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
  usePreNotaStore,             // Store principal da pré-nota
  usePreNotaAuxStore,          // Store auxiliar geral
  useXmlDataLoadedStatus,      // Seletor para flag XML carregado
  useFornecedorSearchResult,   // Seletor para resultado da busca de fornecedor
  useSelectedFornecedor,     // Seletor para fornecedor selecionado (com nome)
} from "@inclusao/stores";      // Stores (usando aliases)
// --- Tipos Importantes ---
// Importa Fornecedor (que contém Pedido[]) da definição da API ou de types se movido
import type { Fornecedor, Pedido } from "@inclusao/api";
// Importa PreNotaItem da definição de tipos da inclusão/prenota
import type { PreNotaItem } from "@inclusao/types";

// Estrutura interna para as opções formatadas exibidas na lista
interface FormattedOption {
  uniqueId: string; // Combinação de código e loja
  cod: string;      // Código ou CNPJ do fornecedor
  loja: string;
  desc: string;     // Nome formatado para exibição
  cnpj: string;     // CNPJ original para exibição formatada
  original: Fornecedor; // Objeto Fornecedor original com todos os dados (incluindo PEDIDOS)
}

export function FornecedorDialog() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState(""); // Termo de busca digitado no input

  // --- Hooks e Stores ---
  // Hook para realizar a busca
  const { searchFornecedor, isLoading, error: searchError } = useSearchFornecedorPedidos();
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
  const options = useMemo((): FormattedOption[] => {
    if (!searchResult) return []; // Retorna vazio se não houver resultado
    return searchResult.map((forn) => ({
      uniqueId: `${forn.A2_COD}-${forn.A2_LOJA}`,
      cod: forn.A2_COD, // Guarda o código original (pode ser CNPJ se A2_COD for CNPJ)
      loja: forn.A2_LOJA,
      desc: forn.A2_NOME || forn.A2_NREDUZ || `Cod: ${forn.A2_COD} / Loja: ${forn.A2_LOJA}`, // Usa nome, nome reduzido ou fallback
      cnpj: forn.A2_CGC, // Guarda CNPJ para formatação
      original: forn, // Mantém referência ao objeto completo
    }));
  }, [searchResult]); // Recalcula somente se o resultado da busca mudar

  // Define o texto do botão principal
  const buttonLabel = useMemo(() => {
    // Prioridade 1: Nome do fornecedor selecionado (vindo do store auxiliar)
    // Verifica se corresponde ao header principal para consistência
    if (
      selectedFornecedorInfo &&
      selectedFornecedorInfo.cod === currentHeader.FORNECEDOR &&
      selectedFornecedorInfo.loja === currentHeader.LOJA &&
      selectedFornecedorInfo.nome
    ) {
      return selectedFornecedorInfo.nome;
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

    // 1. Atualiza o Header no Store Principal (usePreNotaStore) com Cód/Loja
    setHeader({
      FORNECEDOR: selectedOption.cod,
      LOJA: selectedOption.loja,
    });

    // 2. Atualiza o Fornecedor Selecionado no Store Auxiliar (usePreNotaAuxStore) com Cód/Loja/Nome
    setSelectedFornecedor({
        cod: selectedOption.cod,
        loja: selectedOption.loja,
        nome: selectedOption.desc, // O nome formatado da opção
    });

    // 3. Popula Itens (Condicional): Se XML não foi carregado e há pedidos
    if (!xmlFoiCarregado && selectedOption.original.PEDIDOS?.length > 0) {
      console.log("XML não carregado, populando itens a partir dos pedidos...");
      const pedidosDoFornecedor = selectedOption.original.PEDIDOS;

      // Mapeia os itens do pedido selecionado para o formato PreNotaItem
      const mappedItens: PreNotaItem[] = pedidosDoFornecedor.map(
        (itemPedido: Pedido, index): PreNotaItem => { // Tipagem explícita aqui
          const baseItem: PreNotaItem = {
              ITEM: String(index + 1).padStart(4, '0'),
              PRODUTO: itemPedido.C7_PRODUTO || '',
              QUANTIDADE: itemPedido.C7_QUANT || 0,
              VALUNIT: itemPedido.C7_PRECO || 0,
              PRODFOR: '', // Não disponível nos dados do pedido (seria cód. prod. no forn.)
              DESCFOR: itemPedido.B1_DESC || '',
              ORIGEMXML: '', // Não aplicável aqui
              TOTAL: itemPedido.C7_TOTAL || 0,
              PC: itemPedido.C7_NUM || '',
              ITEMPC: itemPedido.C7_ITEM || '',
              B1_UM: itemPedido.B1_UM || '',
              ORIGEM: itemPedido.B1_ORIGEM || '',
              // Adicione outros campos necessários da interface PreNotaItem com defaults
          };
          // Remove chaves com valor undefined (limpeza opcional)
          Object.keys(baseItem).forEach(
              (key) => baseItem[key as keyof PreNotaItem] === undefined && delete baseItem[key as keyof PreNotaItem]
          );
          return baseItem;
        }
      );

      // Atualiza os itens no store principal
      setItens(mappedItens);
      console.log(`Itens da PreNota populados com ${mappedItens.length} itens.`);
    } else if (xmlFoiCarregado) {
        console.log("Seleção feita, mas itens não foram populados (XML já carregado).");
         // Poderia limpar os itens se a intenção for *substituir* os do XML?
         // setItens([]); // Descomente se este for o comportamento desejado
    } else {
        console.log("Seleção feita, fornecedor sem pedidos para popular.");
        setItens([]); // Limpa itens se o fornecedor selecionado não tiver pedidos
    }

    // 4. Fecha o diálogo e limpa o termo de busca
    setOpen(false);
    setTerm("");
  };

  // Dispara a busca ao pressionar Enter no input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && term.trim()) {
      e.preventDefault();
      searchFornecedor({ busca: term.trim(), reca2: "" }); // reca2 como vazio (ajuste se necessário)
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
                      <span>Cod: {opt.cod} / Loja: {opt.loja}</span>
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