import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  Button,
} from "ui";
import { useLikeProdutoQuery } from "../hooks";
import { usePedidoCompraStore } from "..";
import { Check, PackageSearch } from "lucide-react";

export function ProdutoDialog() {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(""); // termo digitado no input
  const [searchTerm, setSearchTerm] = useState(""); // termo de busca confirmado (ao pressionar Enter)

  // Busca os produtos cujo código ou descrição correspondem ao searchTerm.
  // A busca é acionada apenas quando searchTerm não é vazio (geralmente após Enter).
  const { data, isLoading, isError } = useLikeProdutoQuery(searchTerm);
  const produtos = data || []; // lista de produtos retornados (ou vazia)

  // Obtém o produto atualmente selecionado no draft da store (pode ser código ou objeto completo).
  const currentProduct = usePedidoCompraStore((state) => state.draft.PRODUTO);
  const setDraft = usePedidoCompraStore((state) => state.setDraft);

  // Deriva o código do produto atual (caso seja armazenado como objeto) para comparação.
  const currentProductCode = useMemo(() => {
    if (!currentProduct) return null;
    return typeof currentProduct === "string"
      ? currentProduct
      : currentProduct.B1_COD;
  }, [currentProduct]);

  // Handler para seleção de um produto da lista.
  const handleSelectProduto = useCallback(
    (produtoSelecionado) => {
      // Atualiza o draft.PRODUTO na store com o produto selecionado
      setDraft((prevDraft) => ({
        ...prevDraft,
        PRODUTO: produtoSelecionado,
      }));
      // Fecha o diálogo após selecionar
      setOpen(false);
    },
    [setDraft]
  );

  // Handler para tecla Enter no campo de busca: atualiza o termo de busca para disparar a query
  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (inputValue.trim() !== "") {
          setSearchTerm(inputValue.trim());
        }
      }
    },
    [inputValue]
  );

  // Limpa o termo de busca e resultados ao fechar o diálogo, para começar limpo na próxima vez
  useEffect(() => {
    if (!open) {
      setInputValue("");
      setSearchTerm("");
    }
  }, [open]);

  return (
    <>
      {/* Botão principal que abre o diálogo de produtos */}
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="justify-between"
      >
        {/* Texto do botão mostra o produto selecionado ou um convite à seleção */}
        {currentProductCode
          ? `${currentProductCode} - ${
              currentProduct && typeof currentProduct !== "string"
                ? currentProduct.B1_DESC
                : ""
            }`
          : "Selecionar produto"}
        <PackageSearch className="ml-2 h-4 w-4 opacity-50" />
      </Button>

      {/* Dialog de comando para busca de produtos */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        {/* Campo de entrada para digitar o termo de busca */}
        <CommandInput
          value={inputValue}
          onValueChange={setInputValue}
          onKeyDown={handleInputKeyDown}
          placeholder="Buscar por código ou descrição do produto"
        />
        <CommandList>
          {/* Estado de carregamento: mostrando mensagem de busca */}
          {isLoading && (
            <CommandItem disabled>Buscando produtos...</CommandItem>
          )}
          {/* Estado de erro: mostrando mensagem de erro */}
          {isError && (
            <CommandItem disabled>Erro ao buscar produtos.</CommandItem>
          )}
          {/* Lista de produtos encontrados */}
          {produtos.map((prod) => {
            // Verifica se este produto é o atualmente selecionado no draft
            const isSelected = currentProductCode === prod.B1_COD;
            return (
              <CommandItem
                key={prod.B1_COD}
                onSelect={() => handleSelectProduto(prod)}
              >
                {/* Informações do produto: código - descrição (unidade) local - grupo */}
                {prod.B1_COD} – {prod.B1_DESC} ({prod.B1_UM}) {prod.B1_LOCPAD} –{" "}
                {prod.B1_GRUPO}
                {/* Ícone de check se for o item atualmente selecionado */}
                {isSelected && <Check className="ml-auto h-4 w-4" />}
              </CommandItem>
            );
          })}
          {/* Estado de nenhum resultado encontrado (só exibido se a busca terminou sem resultados) */}
          {!isLoading && !isError && searchTerm && produtos.length === 0 && (
            <CommandEmpty>Nenhum produto encontrado.</CommandEmpty>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
