"use client";

import { FilterInputs } from "../../types/types.filterInputs";
import { ZoomInIcon, PlusIcon } from "@radix-ui/react-icons";
import { useDataTableStore } from "ui/data-table"; // Ajuste o caminho
import { CAMPOS_FILTRO } from "@borracharia/config"; // Ajuste o caminho
import { FilterRow } from "./linha";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  Button,
  ScrollArea,
  Card,
} from "ui"; // Ajuste o caminho
import { useBorrachariaTableStore } from "../../stores";
import { usePortariaTableStore } from "@/app/(modules)/controle/portaria/_lib/stores";
import { useHistoricoTableStore } from "@/app/(modules)/controle/_lib/stores";

interface LocalFilterState {
  id: string;
  field: keyof FilterInputs;
  value: any;
}

/**
 * Componente Modal para configurar e aplicar filtros.
 * Layout: Botão Adicionar no topo, filtros em um card único abaixo.
 * Filial é tratada como um filtro dinâmico comum.
 */
export function DataTableFilterModal({selectPage}: {selectPage?: string}) {
  const logPrefix = "[DataTableFilterModal]";
  const dataTablePage = selectPage === "borracharia" ? useBorrachariaTableStore() : (selectPage === "portaria" ? usePortariaTableStore() : (selectPage === "historico" ? useHistoricoTableStore() : useDataTableStore()));
  const [isOpen, setIsOpen] = useState(false);
  const [internalFilters, setInternalFilters] = useState<LocalFilterState[]>(
    []
  );
  const {
    setFilters,
    clearFilters,
    filters: appliedFilters,
  } = dataTablePage;

  // Efeito para carregar filtros aplicados ao abrir
  useEffect(() => {
    if (isOpen) {
      console.log(`${logPrefix} Modal aberto. Carregando estado da store.`);
      const loadedFilters = Object.entries(appliedFilters || {}).map(
        ([field, value], index) => ({
          id: `filter-load-${Date.now()}-${index}`,
          field: field as keyof FilterInputs,
          value,
        })
      );
      setInternalFilters(loadedFilters);
    }
  }, [isOpen, appliedFilters]);

  // Handlers para Filtros Dinâmicos
  const handleAddFilter = () => {
    const availableFields = CAMPOS_FILTRO.filter(
      (f) => !internalFilters.some((intF) => intF.field === f.campo)
    );
    if (!availableFields.length) {
      toast.info("Todos os campos de filtro disponíveis já foram adicionados.");
      return;
    }
    const defaultFieldConfig = availableFields[0];
    const defaultField = defaultFieldConfig.campo;
    let defaultValue: any;
    switch (defaultFieldConfig?.tipo) {
      case "select-multiple":
      case "filial-select":
        defaultValue = [];
        break;
      case "data-range":
      case "numero-range":
        defaultValue = { from: "", to: "" };
        break;
      default:
        defaultValue = "";
        break;
    }
    setInternalFilters((prev) => [
      ...prev,
      { id: `filter-${Date.now()}`, field: defaultField, value: defaultValue },
    ]);
    console.log(`${logPrefix} Filtro adicionado:`, {
      field: defaultField,
      value: defaultValue,
    });
  };

  const handleChangeFilter = (id: string, field: keyof FilterInputs, value: any) => {
    console.log(`${logPrefix} Alterando filtro:`, { id, field, value });
    setInternalFilters((prevFilters) =>
      prevFilters.map((f) => (f.id === id ? { ...f, field, value } : f))
    );
  };

  const handleRemoveFilter = (id: string) => {
    console.log(`${logPrefix} Removendo filtro ID:`, id);
    setInternalFilters((prevFilters) => prevFilters.filter((f) => f.id !== id));
  };

  // Handler para aplicar filtros
  const handleApply = () => {
    console.groupCollapsed(`${logPrefix} Aplicando Filtros`);
    const finalFilterObject: Record<string, any> = {};
    console.log("Filtros internos:", internalFilters);

    internalFilters.forEach((f) => {
      // Lógica para verificar se valor é vazio (igual à anterior)
      const isEmptyString =
        typeof f.value === "string" && f.value.trim() === "";
      const isEmptyArray = Array.isArray(f.value) && f.value.length === 0;
      const isEmptyRange =
        typeof f.value === "object" &&
        f.value !== null &&
        !Array.isArray(f.value) &&
        (f.value.from === undefined || f.value.from === "") &&
        (f.value.to === undefined || f.value.to === "");
      const isTrulyEmpty =
        f.value === undefined ||
        f.value === null ||
        isEmptyString ||
        isEmptyArray ||
        isEmptyRange;

      if (isTrulyEmpty) {
        console.log(` - Ignorando ${f.field}: valor vazio.`);
        return; // Pula filtro vazio
      }

      console.log(
        ` - Processando: Campo=${f.field}, Valor=${JSON.stringify(f.value)}`
      );

      // Lógica para ranges (garante strings, só adiciona se não vazio)
      const fieldConfig = CAMPOS_FILTRO.find((cf) => cf.campo === f.field);
      if (
        (fieldConfig?.tipo === "data-range" ||
          fieldConfig?.tipo === "numero-range") &&
        typeof f.value === "object" &&
        f.value !== null &&
        !Array.isArray(f.value)
      ) {
        const rangeValue = {
          from: String(f.value.from ?? ""),
          to: String(f.value.to ?? ""),
        };
        if (rangeValue.from !== "" || rangeValue.to !== "") {
          finalFilterObject[f.field] = rangeValue;
        } else {
          console.log(` - Ignorando ${f.field}: range vazio.`);
        }
      }
      // Outros campos (incluindo F1_FILIAL e Status que vêm como array direto)
      else {
        finalFilterObject[f.field] = f.value;
      }
    });

    console.log(
      "Objeto de Filtro final (enviado para store):",
      finalFilterObject
    );
    setFilters(finalFilterObject); // Aplica na store global
    console.groupEnd();
    setIsOpen(false); // Fecha o modal
  };

  // Handler para limpar filtros
  const handleClear = () => {
    console.log(`${logPrefix} Limpando filtros.`);
    clearFilters(); // Limpa store global (filters, filials, searchTerm)
    setInternalFilters([]); // Limpa estado local
  };

  // Verifica se há filtros locais ativos para habilitar botões
  const hasActiveLocalFilters = internalFilters.some(
    (f) =>
      f.value !== undefined &&
      f.value !== null &&
      f.value !== "" &&
      (!Array.isArray(f.value) || f.value.length > 0) &&
      (typeof f.value !== "object" ||
        Array.isArray(f.value) ||
        f.value === null ||
        (f.value.from !== undefined && f.value.from !== "") ||
        (f.value.to !== undefined && f.value.to !== ""))
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1.5 px-3">
          <ZoomInIcon className="size-4" />
          <span>Filtrar</span>
          {/* Badge Opcional */}
          {Object.keys(appliedFilters || {}).length > 0 ? (
            <span className="ml-1.5 inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
              {Object.keys(appliedFilters).length}
            </span>
          ) : null}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Filtrar Borracharia</DialogTitle>
          <DialogDescription>
            Adicione ou remova filtros para refinar os resultados.
          </DialogDescription>
        </DialogHeader>

        {/* --- Layout Alterado --- */}
        <div className="py-4 space-y-4">
          {/* Botão Adicionar no Topo */}
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddFilter}
              className="gap-1 w-full sm:w-auto"
            >
              <PlusIcon className="size-4" />
              Adicionar Filtro
            </Button>
          </div>

          {/* Card Único Contendo os Filtros */}

          {/* Container do Card */}
          <Card className="overflow-hidden max-h-[50vh] px-2 py-4">
            <ScrollArea className="h-full overflow-auto">
              {internalFilters.length > 0 ? (
                <div className="divide-y divide-border/40">
                  {internalFilters.map((filter) => (
                    <div className="px-3 first:pt-0 last:pb-0" key={filter.id}>
                      <FilterRow
                        filter={filter}
                        onChange={handleChangeFilter}
                        onRemove={handleRemoveFilter}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6 px-4">
                  Nenhum filtro adicionado. Clique em "Adicionar Filtro" acima.
                </p>
              )}
            </ScrollArea>
          </Card>
          {/* --- Fim Layout Alterado --- */}
        </div>

        <DialogFooter className="mt-2 flex flex-row justify-between sm:justify-between border-t pt-4 px-1 pb-1">
          <Button
            variant="destructive"
            onClick={handleClear}
            disabled={!hasActiveLocalFilters}
          >
            Limpar Filtros
          </Button>
          <Button onClick={handleApply} disabled={!hasActiveLocalFilters} className="text-white">
            Aplicar Filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
