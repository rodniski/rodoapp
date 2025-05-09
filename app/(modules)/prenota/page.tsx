"use client";

import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  DataTable,
  DataTablePagination,
  useDataTableStore,
} from "ui/data-table";
import { Background } from "comp";
import { Button, Badge } from "ui";
import { X, RotateCcw } from "lucide-react";
import { useAuthStore } from "@login/stores";
import { columns, usePrenotas } from "@prenota/tabela";
import { DataTableFilterModal } from "@prenota/filtro";
import type { PrenotaRow } from "@prenota/tabela";

// Mapeamento de IDs de filtros para labels amigáveis
const filterLabels: Record<string, string> = {
  F1_DOC: "Número do Documento",
  A2_NOME: "Fornecedor",
  F1_DTDIGIT: "Data de Digitação",
  F1_EMISSAO: "Data de Emissão",
  Status: "Status",
  F1_VALBRUT: "Valor Bruto",
  F1_XOBS: "Observação",
};

export default function PrenotaPage() {
  const {
    pageIndex,
    pageSize,
    sorting,
    searchTerm,
    filters,
    filials,
    setFilials,
    setPagination,
    clearFilters,
    setSorting,
    setFilters,
  } = useDataTableStore();

  const { filiais: authFiliais, isLoading: authLoading } = useAuthStore();

  // Memoizar activeFilials para evitar recalcular em cada render
  const activeFilials = useMemo(
    () => (filials.length > 0 ? filials : authFiliais.map((f) => f.M0_CODFIL)),
    [filials, authFiliais]
  );

  // Define filiais padrão com base na autenticação
  useEffect(() => {
    if (authFiliais.length > 0 && filials.length === 0) {
      const defaultFilialCodes = authFiliais.map((f) => f.M0_CODFIL);
      setFilials(defaultFilialCodes);
    }
  }, [authFiliais, filials, setFilials]);

  // Busca os dados com base no estado da store
  const { data, isLoading, isError, error } = usePrenotas({
    page: pageIndex + 1,
    pageSize,
    sorting,
    filials: activeFilials,
    searchTerm,
    filters,
  });

  // Log para depurar dados, especialmente F1_XPRIOR
  useEffect(() => {
    if (data?.data) {
      console.log("Dados brutos de usePrenotas:", data.data);
      console.log(
        "Valores de F1_XPRIOR:",
        data.data.map((row: PrenotaRow) => row.F1_XPRIOR)
      );
    }
  }, [data?.data]);

  // Atualiza a paginação na store quando os dados chegam
  useEffect(() => {
    if (
      data?.pagination &&
      typeof data.pagination.page === "number" &&
      typeof data.pagination.pageSize === "number" &&
      typeof data.pagination.totalCount === "number" &&
      typeof data.pagination.totalPages === "number"
    ) {
      setPagination({
        page: data.pagination.page,
        pageSize: data.pagination.pageSize,
        totalCount: data.pagination.totalCount,
        totalPages: data.pagination.totalPages,
      });
    }
  }, [data?.pagination, setPagination]); // Removido isLoading, isError, pageSize das dependências

  // Exibe toasts de erro
  useEffect(() => {
    if (isError && error) {
      toast.error("Erro ao buscar pré-notas", {
        description: error.message,
        duration: 5000,
      });
    }
  }, [isError, error]);

  // Formata o valor do filtro para exibição
  const formatFilterValue = (field: string, value: any): string => {
    if (field === "Status" && Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "string") {
      return value;
    }
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (
      typeof value === "object" &&
      value !== null &&
      (value.from || value.to)
    ) {
      const from = value.from
        ? value.from.toString().replace(/(\d{4})(\d{2})(\d{2})/, "$3/$2/$1")
        : "";
      const to = value.to
        ? value.to.toString().replace(/(\d{4})(\d{2})(\d{2})/, "$3/$2/$1")
        : "";
      if (from && to) return `${from} até ${to}`;
      if (from) return `a partir de ${from}`;
      if (to) return `até ${to}`;
    }
    return String(value);
  };

  // Remove um filtro específico
  const removeFilter = (fieldToRemove: string) => {
    const newFilters = { ...filters };
    delete newFilters[fieldToRemove];
    setFilters(newFilters);
  };

  // Reseta a ordenação
  const resetSorting = () => {
    setSorting([]);
  };

  const showClearButton = Object.keys(filters).length > 0;
  const showResetSortButton = sorting.length > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-50px)] overflow-hidden p-0">
      <Background />
      <div className="z-10 w-full h-full p-4 lg:p-8 qhd:p-12 flex flex-col gap-4">
        {/* Cabeçalho com filtros ativos e botões de ação */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Filtros Ativos */}
          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(filters).map(
              ([field, value]) =>
                value !== null &&
                value !== undefined &&
                value !== "" &&
                (!Array.isArray(value) || value.length > 0) && (
                  <Badge
                    key={field}
                    variant="secondary"
                    className="flex items-center gap-1 pl-2 pr-1 py-1"
                  >
                    <span className="text-sm font-normal">
                      {filterLabels[field] || field}:{" "}
                      {formatFilterValue(field, value)}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-5 w-5 hover:bg-destructive/20 rounded-full"
                      onClick={() => removeFilter(field)}
                      aria-label={`Remover filtro ${
                        filterLabels[field] || field
                      }`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )
            )}
            {showClearButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="ml-2"
                aria-label="Limpar todos os filtros e seleção de filiais"
              >
                <X className="mr-1 h-4 w-4" /> Limpar Filtros
              </Button>
            )}
            {showResetSortButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetSorting}
                className="ml-2"
                aria-label="Resetar ordenação da tabela"
              >
                <RotateCcw className="mr-1 h-4 w-4" /> Resetar Ordenação
              </Button>
            )}
          </div>
          {/* Botão para Abrir Modal de Filtros */}
          <DataTableFilterModal aria-label="Abrir modal de filtros" />
        </div>

        {/* Tabela de Dados */}
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={authLoading || isLoading}
          className="w-full backdrop-blur-2xl bg-card/60 rounded-xl border"
        >
          <DataTablePagination />
        </DataTable>
      </div>
    </div>
  );
}
