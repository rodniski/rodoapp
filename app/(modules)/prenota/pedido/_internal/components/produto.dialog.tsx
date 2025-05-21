import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "ui";
import { useSearchProducts } from "../config/hook.produto"; // Ajuste o caminho
import { Check } from "lucide-react";
import { type ClientProductSearchResult } from "../config/type.produto";

// A interface PedidoCompraItemDraft foi removida daqui pois não era utilizada.

interface ProdutoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductSelect: (produto: ClientProductSearchResult) => void;
  initialSearchTerm?: string;
  currentSelectedProductCode?: string | null;
}

export function ProdutoDialog({
  open,
  onOpenChange,
  onProductSelect,
  initialSearchTerm = "",
  currentSelectedProductCode,
}: ProdutoDialogProps) {
  const [inputValue, setInputValue] = useState(initialSearchTerm);
  const [searchTermForQuery, setSearchTermForQuery] = useState(initialSearchTerm);

  const {
    data: produtosEncontrados,
    isLoading,
    isError,
    error,
  } = useSearchProducts({
    searchTerm: searchTermForQuery,
    limit: 20,
    enabled: searchTermForQuery.trim().length > 1,
  });

  const produtos = useMemo(() => produtosEncontrados || [], [produtosEncontrados]);

  const handleInternalSelect = useCallback(
    (produto: ClientProductSearchResult) => {
      onProductSelect(produto);
      onOpenChange(false);
    },
    [onProductSelect, onOpenChange]
  );

  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const trimmedValue = inputValue.trim();
        if (trimmedValue.length > 1) {
          setSearchTermForQuery(trimmedValue);
        } else if (trimmedValue.length === 0) {
          setSearchTermForQuery("");
        }
      }
    },
    [inputValue]
  );

  useEffect(() => {
    if (open) {
      setInputValue(initialSearchTerm || "");
      setSearchTermForQuery(initialSearchTerm || "");
    } else {
      // Limpa o input e a busca ao fechar, se desejado
      // setInputValue("");
      // setSearchTermForQuery("");
    }
  }, [open, initialSearchTerm]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        value={inputValue}
        onValueChange={setInputValue}
        onKeyDown={handleInputKeyDown}
        placeholder="Buscar por código ou descrição (Enter para buscar)"
      />
      <CommandList>
        {isLoading && searchTermForQuery.trim().length > 1 && (
          <CommandItem disabled className="text-muted-foreground text-center justify-center">Buscando produtos...</CommandItem>
        )}
        {isError && (
          <CommandItem disabled className="text-destructive text-center justify-center">
            Erro ao buscar: {error?.message || "Tente novamente."}
          </CommandItem>
        )}
        {!isLoading && !isError && produtos.length > 0 && (
          produtos.map((prod) => {
            const isSelected = currentSelectedProductCode === prod.B1_COD;
            return (
              <CommandItem
                key={prod.R_E_C_N_O_}
                value={`${prod.B1_COD} ${prod.B1_DESC}`}
                onSelect={() => handleInternalSelect(prod)}
                className="relative flex justify-between items-center"
              >
                <span className="flex flex-col">
                  <span className="font-medium">{prod.B1_COD} – {prod.B1_DESC}</span>
                  <span className="text-xs text-muted-foreground">
                    {prod.B1_UM && `UM: ${prod.B1_UM} `}
                    {prod.B1_LOCPAD && `Loc: ${prod.B1_LOCPAD} `}
                    {prod.B1_GRUPO && `Grp: ${prod.B1_GRUPO}`}
                  </span>
                </span>
                {isSelected && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </CommandItem>
            );
          })
        )}
        {!isLoading && !isError && searchTermForQuery.trim().length > 1 && produtos.length === 0 && (
          <CommandEmpty>Nenhum produto encontrado para "{searchTermForQuery}".</CommandEmpty>
        )}
        {!searchTermForQuery.trim() && !isLoading && (
           <CommandEmpty>Digite para buscar produtos.</CommandEmpty>
        )}
         {searchTermForQuery.trim().length === 1 && !isLoading && (
           <CommandEmpty>Digite ao menos 2 caracteres.</CommandEmpty>
        )}
      </CommandList>
    </CommandDialog>
  );
}
