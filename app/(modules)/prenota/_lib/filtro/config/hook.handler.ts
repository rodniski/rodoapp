import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useDataTableStore } from "ui/data-table";
import { CAMPOS_FILTRO } from "@prenota/filtro";
import { useFilialOptions } from "utils";
import type { PrenotaRow } from "@prenota/tabela";
import type { ComboboxItem } from "ui";

interface LocalFilterState {
  id: string;
  field: keyof PrenotaRow;
  value: any;
}

export function useFilterModalHandlers() {
  const logPrefix = "[DataTableFilterModal]";
  const [isOpen, setIsOpen] = useState(false);
  const [internalFilters, setInternalFilters] = useState<LocalFilterState[]>([]);
  const { setFilters, clearFilters, filters: appliedFilters } = useDataTableStore();
  const filialOptions = useFilialOptions();

  // Efeito para carregar filtros aplicados ou inicializar com filtro padrão
  useEffect(() => {
    if (isOpen) {
      console.log(`${logPrefix} Modal aberto. Carregando estado da store.`);
      let loadedFilters: LocalFilterState[] = [];

      if (appliedFilters && Object.keys(appliedFilters).length > 0) {
        // Carregar filtros aplicados, filtrando apenas campos válidos de PrenotaRow
        loadedFilters = Object.entries(appliedFilters)
          .filter(([field]) => CAMPOS_FILTRO.some((cf) => cf.campo === field))
          .map(([field, value], index) => ({
            id: `filter-load-${Date.now()}-${index}`,
            field: field as keyof PrenotaRow,
            value,
          }));
      } else {
        // Filtro padrão: F1_FILIAL com value vazio
        loadedFilters = [
          {
            id: `filter-default-${Date.now()}`,
            field: "F1_FILIAL",
            value: [],
          },
        ];
      }

      setInternalFilters(loadedFilters);
    }
  }, [isOpen, appliedFilters]);

  const handleAddFilter = () => {
    const availableFields = CAMPOS_FILTRO.filter(
      (f) => !internalFilters.some((intF) => intF.field === f.campo)
    );
    if (!availableFields.length) {
      toast.info("Todos os campos de filtro disponíveis já foram adicionados.");
      return;
    }
    const defaultFieldConfig = availableFields[0];
    const defaultField = defaultFieldConfig.campo as keyof PrenotaRow;
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

  const handleChangeFilter = (id: string, field: keyof PrenotaRow, value: any) => {
    console.log(`${logPrefix} Alterando filtro:`, { id, field, value });
    setInternalFilters((prevFilters) =>
      prevFilters.map((f) => (f.id === id ? { ...f, field, value } : f))
    );
  };

  const handleRemoveFilter = (id: string) => {
    console.log(`${logPrefix} Removendo filtro ID:`, id);
    setInternalFilters((prevFilters) => prevFilters.filter((f) => f.id !== id));
  };

  const handleApply = () => {
    console.groupCollapsed(`${logPrefix} Aplicando Filtros`);
    const finalFilterObject: Partial<Record<keyof PrenotaRow, any>> = {};
    console.log("Filtros internos:", internalFilters);

    internalFilters.forEach((f) => {
      const isEmptyString = typeof f.value === "string" && f.value.trim() === "";
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
        return;
      }

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
        }
      } else {
        finalFilterObject[f.field] = f.value;
      }
    });

    console.log("Objeto de Filtro final (enviado para store):", finalFilterObject);
    setFilters(finalFilterObject);
    console.groupEnd();
    setIsOpen(false);
  };

  const handleClear = () => {
    console.log(`${logPrefix} Limpando filtros.`);
    clearFilters();
    setInternalFilters([]);
  };

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

  return {
    isOpen,
    setIsOpen,
    internalFilters,
    handleAddFilter,
    handleChangeFilter,
    handleRemoveFilter,
    handleApply,
    handleClear,
    hasActiveLocalFilters,
    appliedFilters,
    filialOptions,
  };
}