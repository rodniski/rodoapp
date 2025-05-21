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
import { Loader2, Users, Check } from "lucide-react";
import { useSearchFornecedorPedidos } from "@inclusao/hooks";
import { formatCNPJ } from "utils";
import {
  useXmlDataLoadedStatus,
  useFornecedorSearchResult,
  useSelectedFornecedor,
  usePreNotaAuxStore,
} from "@inclusao/stores";
import { usePedidoCompraStore } from "..";
import type { Fornecedor } from "@inclusao/api";

interface FormattedOption {
  uniqueId: string;
  cod: string;
  loja: string;
  apelido: string;
  desc: string;
  cnpj: string;
  original: Fornecedor;
}

export function FornecedorDialog() {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");

  const { searchFornecedor, isLoading, error } = useSearchFornecedorPedidos();
  const results = useFornecedorSearchResult();
  const isXmlMode = useXmlDataLoadedStatus();
  const selectedAux = useSelectedFornecedor();

  const currentDraft = usePedidoCompraStore((s) => s.draft);
  const setDraft = usePedidoCompraStore((s) => s.setDraft);

  const options = useMemo<FormattedOption[]>(() => {
    if (!Array.isArray(results) || results.length === 0) return [];
    return results.map((forn) => ({
      uniqueId: `${forn.A2_COD}-${forn.A2_LOJA}`,
      cod: forn.A2_COD,
      loja: forn.A2_LOJA,
      apelido: forn.APELIDO,
      desc:
        forn.A2_NOME ||
        forn.A2_NREDUZ ||
        `Cod: ${forn.A2_COD} / Loja: ${forn.A2_LOJA}`,
      cnpj: forn.A2_CGC,
      original: forn,
    }));
  }, [results]);

  const buttonLabel = useMemo(() => {
    if (
      selectedAux?.A2_COD === currentDraft.FORNECEDOR &&
      selectedAux?.A2_LOJA === currentDraft.LOJA &&
      selectedAux.A2_NOME
    ) {
      return selectedAux.A2_NOME;
    }
    if (currentDraft.FORNECEDOR && currentDraft.LOJA) {
      return `Cod: ${currentDraft.FORNECEDOR} / Loja: ${currentDraft.LOJA}`;
    }
    return "Selecionar fornecedor";
  }, [selectedAux, currentDraft]);

  const handleSelect = (opt: FormattedOption) => {
    setDraft({ FORNECEDOR: opt.cod, LOJA: opt.loja });
    usePreNotaAuxStore.getState().selection.setSelectedFornecedor({
      ...opt.original,
    });
    setOpen(false);
    setTerm("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (options.length) {
      handleSelect(options[0]);
    } else if (term.trim()) {
      searchFornecedor({ busca: term.trim() });
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-full justify-between"
        onClick={() => !isXmlMode && setOpen(true)}
        disabled={isXmlMode}
        title={isXmlMode ? "Desabilitado em modo XML" : buttonLabel}
      >
        <span className="truncate">{buttonLabel}</span>
        <Users className="h-4 w-4 opacity-60" />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setTerm("");
        }}
      >
        <CommandInput
          autoFocus
          placeholder="Buscar fornecedor por nome, CNPJ, código ou loja..."
          value={term}
          onValueChange={setTerm}
          onKeyDown={onKeyDown}
        />
        <CommandList>
          {error && (
            <div className="p-4 text-sm text-destructive">
              Erro: {String(error)}
            </div>
          )}
          {isLoading && (
            <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Buscando
              fornecedores...
            </div>
          )}
          {!isLoading && !error && options.length > 0 && (
            <CommandGroup heading="Fornecedores Encontrados">
              {options.map((opt) => {
                const f = opt.original;
                return (
                  <CommandItem
                    key={opt.uniqueId}
                    onSelect={() => handleSelect(opt)}
                    value={opt.uniqueId}
                    className="flex flex-col items-start py-2"
                  >
                    <span className="font-medium">({opt.cod} - {opt.loja}) {opt.desc}</span>
                    <div className="flex flex-wrap text-xs text-muted-foreground gap-x-4">
                      <span>CNPJ: {formatCNPJ(f.A2_CGC)} - {f.A2_MUN}/{f.A2_EST}</span>
                    </div>
                    {currentDraft.FORNECEDOR === opt.cod &&
                      currentDraft.LOJA === opt.loja && (
                        <Check className="absolute right-2 top-1/2 -translate-y-1/2 text-primary" />
                      )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
          {!isLoading && !error && options.length === 0 && (
            <CommandEmpty>
              {term.trim()
                ? "Nenhum fornecedor encontrado para esse termo."
                : "Digite para começar a busca e pressione Enter."}
            </CommandEmpty>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
