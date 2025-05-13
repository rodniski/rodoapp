"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { useSearchFornecedorPedidos } from "@inclusao/hooks";
import { formatCNPJ } from "utils";
import {
  usePreNotaStore,
  usePreNotaAuxStore,
  useXmlDataLoadedStatus,
  useFornecedorSearchResult,
  useSelectedFornecedor,
} from "@inclusao/stores";
import type { Fornecedor } from "@inclusao/api";
import type { PreNotaItem } from "@inclusao/types";
import { HeaderSchemaParsed } from "@inclusao/validation/prenota.schema";

// Estrutura interna para as opções formatadas exibidas na lista
interface FormattedOption {
  uniqueId: string;
  cod: string;
  loja: string;
  desc: string;
  cnpj: string;
  original: Fornecedor;
}

// Novas props para interagir com React Hook Form do pai
interface FornecedorDialogProps {
  // Tipagem para setValue e trigger do React Hook Form
  // Use FieldValues se HeaderSchemaParsed não estiver acessível ou for muito específico
  setValueRHF: (
    name: keyof HeaderSchemaParsed, // Ou string se preferir menos acoplamento de tipo
    value: any,
    options?: {
      shouldValidate?: boolean;
      shouldDirty?: boolean;
      shouldTouch?: boolean;
    }
  ) => void;
  triggerRHF?: (
    name?: keyof HeaderSchemaParsed | (keyof HeaderSchemaParsed)[]
  ) => void;
}

export function FornecedorDialog({
  setValueRHF,
  triggerRHF,
}: FornecedorDialogProps) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");

  const {
    searchFornecedor,
    isLoading,
    error: searchError,
  } = useSearchFornecedorPedidos();

  const searchResult = useFornecedorSearchResult();
  const xmlFoiCarregado = useXmlDataLoadedStatus();
  const selectedFornecedorInfo = useSelectedFornecedor();

  const currentHeader = usePreNotaStore((state) => state.draft.header);
  // setHeader não será mais usado diretamente para FORNECEDOR/LOJA daqui
  const setItens = usePreNotaStore((state) => state.setItens);
  const isXmlMode = usePreNotaStore((state) => state.mode === "xml");
  const { setSelectedFornecedor } = usePreNotaAuxStore.getState().selection;

  const options = useMemo((): FormattedOption[] => {
    if (!Array.isArray(searchResult) || searchResult.length === 0) return [];
    return searchResult.map((forn) => ({
      uniqueId: `${forn.A2_COD}-${forn.A2_LOJA}`,
      cod: forn.A2_COD,
      loja: forn.A2_LOJA,
      desc:
        forn.A2_NOME ||
        forn.A2_NREDUZ ||
        `Cod: ${forn.A2_COD} / Loja: ${forn.A2_LOJA}`,
      cnpj: forn.A2_CGC,
      original: forn,
    }));
  }, [searchResult]);

  const buttonLabel = useMemo(() => {
    if (
      selectedFornecedorInfo &&
      selectedFornecedorInfo.A2_COD === currentHeader.FORNECEDOR &&
      selectedFornecedorInfo.A2_LOJA === currentHeader.LOJA &&
      selectedFornecedorInfo.A2_NOME
    ) {
      return selectedFornecedorInfo.A2_NOME;
    }
    if (currentHeader.FORNECEDOR && currentHeader.LOJA) {
      return `Cod: ${currentHeader.FORNECEDOR} / Loja: ${currentHeader.LOJA}`;
    }
    return "Selecionar fornecedor";
  }, [selectedFornecedorInfo, currentHeader.FORNECEDOR, currentHeader.LOJA]);

  const handleSelectSupplier = useCallback(
    (selectedOption: FormattedOption) => {
      console.log("Fornecedor Selecionado Manualmente:", selectedOption);

      // 1. Atualizar React Hook Form no HeaderForm
      setValueRHF("FORNECEDOR", selectedOption.original.A2_COD, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValueRHF("LOJA", selectedOption.original.A2_LOJA, {
        shouldValidate: true,
        shouldDirty: true,
      });
      // Opcional: disparar validação para outros campos se necessário
      if (triggerRHF) {
        triggerRHF(["FORNECEDOR", "LOJA"]);
      }

      // 2. Salvar informações do fornecedor no store auxiliar (para exibição do nome, etc.)
      const { PEDIDOS, ...fornecedorSemPedidos } = selectedOption.original;
      setSelectedFornecedor(fornecedorSemPedidos);

      // 3. Lógica de popular itens (mantida)
      if (!xmlFoiCarregado && PEDIDOS && PEDIDOS.length > 0) {
        console.log(
          "XML não carregado, populando itens a partir dos pedidos..."
        );
        const mappedItens: PreNotaItem[] = PEDIDOS.map((itemPedido, index) => ({
          ITEM: String(index + 1).padStart(4, "0"),
          PRODUTO: itemPedido.C7_PRODUTO || "",
          QUANTIDADE: itemPedido.C7_QUANT || 0,
          VALUNIT: itemPedido.C7_PRECO || 0,
          DESCFOR: itemPedido.B1_DESC || "",
          TOTAL: itemPedido.C7_TOTAL || 0,
          PC: itemPedido.C7_NUM || "",
          ITEMPC: itemPedido.C7_ITEM || "",
          B1_UM: itemPedido.B1_UM || "",
          ORIGEM: itemPedido.B1_ORIGEM || "",
          PRODFOR: "",
          ORIGEMXML: "",
          SEGUN: "",
          TPFATO: "",
          CONV: 1,
        }));
        setItens(mappedItens);
        console.log(
          `Itens da PreNota populados com ${mappedItens.length} itens.`
        );
      } else if (!xmlFoiCarregado) {
        // Se não for XML e não tiver pedidos, limpa itens
        console.log(
          "XML não carregado e sem pedidos do fornecedor, limpando itens."
        );
        setItens([]);
      }
      // Se xmlFoiCarregado, não mexe nos itens.

      setOpen(false);
      setTerm("");
    },
    [setValueRHF, triggerRHF, setSelectedFornecedor, xmlFoiCarregado, setItens]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key !== "Enter") return;
      e.preventDefault();

      if (
        options.length > 0 &&
        term.trim() === options[0].desc.split(" - ")[0].trim()
      ) {
        // Heurística para ver se o termo corresponde ao primeiro item
        handleSelectSupplier(options[0]);
        return;
      }

      if (term.trim()) {
        searchFornecedor({ busca: term.trim() });
      }
    },
    [options, term, handleSelectSupplier, searchFornecedor]
  );

  const handleInputChange = (value: string) => {
    setTerm(value);
  };

  // Efeito para buscar o fornecedor do draft ao abrir o diálogo, se não houver termo e houver fornecedor no draft
  useEffect(() => {
    if (
      open &&
      !term &&
      currentHeader.FORNECEDOR &&
      currentHeader.LOJA &&
      !searchResult?.length
    ) {
      const initialSearchTerm = currentHeader.FORNECEDOR; // Tenta nome, senão código
      if (initialSearchTerm) {
        setTerm(initialSearchTerm); // Define o termo para o input
        searchFornecedor({ busca: initialSearchTerm.trim() }); // Dispara a busca
      }
    }
  }, [open, term, currentHeader, searchFornecedor, searchResult]);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="w-full justify-between"
        onClick={() => !isXmlMode && setOpen(true)}
        disabled={isXmlMode}
        title={isXmlMode ? "Seleção desabilitada em modo XML" : buttonLabel}
      >
        <span className="truncate">{buttonLabel}</span>
        <Users className="h-4 w-4 opacity-60" />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setTerm("");
            // Opcional: Limpar resultado da busca ao fechar
            // usePreNotaAuxStore.getState().fornecedorSearch.clearSearchResult();
          }
        }}
      >
        <div>
          <CommandInput
            autoFocus
            placeholder="Buscar fornecedor por nome ou CNPJ (Enter para buscar)"
            value={term}
            onValueChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <CommandList data-slot="command-list">
            {searchError && (
              <div className="py-4 px-4 text-center text-sm text-destructive">
                Erro ao buscar: {searchError.toString()}
              </div>
            )}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Carregando...
              </div>
            )}
            {!isLoading && !searchError && options.length > 0 && (
              <CommandGroup heading="Resultados da Busca">
                {options.map((opt) => (
                  <CommandItem
                    key={opt.uniqueId}
                    onSelect={() => handleSelectSupplier(opt)}
                    value={`${opt.desc} ${opt.cod} ${opt.cnpj}`}
                    className="flex flex-col items-start cursor-pointer"
                  >
                    <span className="font-medium">{opt.desc}</span>
                    <div className="w-full flex justify-between text-xs text-muted-foreground">
                      <span>CNPJ: {formatCNPJ(opt.cnpj)}</span>
                      <span>
                        Cod: {opt.cod} / Loja: {opt.loja}
                      </span>
                    </div>
                    {currentHeader.FORNECEDOR === opt.cod &&
                      currentHeader.LOJA === opt.loja && (
                        <Check className="h-4 w-4 absolute right-2 top-1/2 -translate-y-1/2 text-primary" />
                      )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {!isLoading && !searchError && options.length === 0 && (
              <CommandEmpty>
                {term.trim()
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
