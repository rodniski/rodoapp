"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import {
  DataTable,
  DataTablePagination,
  useDataTableStore,
} from "ui/data-table";
import { Background } from "comp";
import { Button, Badge } from "ui";
import { X, RotateCcw } from "lucide-react"; // Importar ícone para reset
import { useAuthStore } from "@login/stores";
import { usePrenotas } from "@prenota/tabela";
import { DataTableFilterModal } from "@prenota/filtro";

// Mapeamento de IDs de filtros para labels amigáveis (ATUALIZADO)
const filterLabels: Record<string, string> = {
  F1_DOC: "Número do Documento",
  A2_NOME: "Fornecedor",
  F1_DTDIGIT: "Data de Digitação",
  F1_EMISSAO: "Data de Emissão",
  Status: "Status", // Label unificada para o filtro de Status calculado
  F1_VALBRUT: "Valor Bruto",
  F1_XOBS: "Observação",
  // Remover F1_STATUS e F1_XREV se não forem mais usados como filtros diretos
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
    setSorting, // Importar a função para definir a ordenação
    setFilters, // Importar para remover filtros individuais
  } = useDataTableStore();

  const { filiais: authFiliais, isLoading: authLoading } = useAuthStore();

  // Limpar filtros ao montar a página (opcional, manter se desejado)
  // useEffect(() => {
  //   clearFilters();
  //   setSorting([]); // Também limpar ordenação ao montar, se necessário
  // }, [clearFilters, setSorting]);

  // Define filiais padrão com base na autenticação
  useEffect(() => {
    if (authFiliais.length > 0 && filials.length === 0) {
      const defaultFilialCodes = authFiliais.map((f) => f.M0_CODFIL);
      setFilials(defaultFilialCodes);
    }
  }, [authFiliais, filials, setFilials]);

  const activeFilials =
    filials.length > 0 ? filials : authFiliais.map((f) => f.M0_CODFIL);

  // Busca os dados com base no estado da store
  const { data, isLoading, isError, error } = usePrenotas({
    page: pageIndex + 1,
    pageSize,
    sorting,
    filials: activeFilials,
    searchTerm,
    filters, // Passar os filtros corretamente para o hook
  });

  // Atualiza a paginação na store quando os dados chegam
  useEffect(() => {
    // Verifica se data.pagination existe e tem as propriedades essenciais
    if (
      data?.pagination &&
      typeof data.pagination.page === "number" &&
      typeof data.pagination.pageSize === "number" &&
      typeof data.pagination.totalCount === "number" &&
      typeof data.pagination.totalPages === "number"
    ) {
      // Atualiza a store sempre que dados válidos chegarem.
      // A store ou os componentes que a consomem devem lidar com memoization se necessário.
      setPagination({
        page: data.pagination.page, // Converte 1-based para 0-based
        pageSize: data.pagination.pageSize,
        totalCount: data.pagination.totalCount,
        totalPages: data.pagination.totalPages,
      });
    }
  }, [data?.pagination, setPagination, isLoading, isError, pageSize]);

  // Exibe toasts de erro/sucesso
  useEffect(() => {
    if (isError && error) {
      toast.error("Erro ao buscar pré-notas", {
        description: error.message,
        duration: 5000,
      });
    }
  }, [isError, error]);

  // Função para formatar o valor do filtro para exibição (ATUALIZADO)
  const formatFilterValue = (field: string, value: any): string => {
    // Trata o filtro de Status (que agora é um array de strings)
    if (field === "Status" && Array.isArray(value)) {
      return value.join(", ");
    }
    // Mantém a lógica para outros tipos
    if (typeof value === "string") {
      return value;
    }
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    // Formata range de datas
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
    return String(value); // Fallback
  };

  // Função para remover um filtro específico (ATUALIZADO)
  const removeFilter = (fieldToRemove: string) => {
    // Cria uma cópia dos filtros atuais
    const newFilters = { ...filters };
    // Remove o filtro específico
    delete newFilters[fieldToRemove];
    // Atualiza o estado na store
    setFilters(newFilters);
  };

  // Função para resetar a ordenação (NOVO)
  const resetSorting = () => {
    setSorting([]); // Define a ordenação como um array vazio para resetar
  };

  const showClearButton = Object.keys(filters).length > 0 || filials.length > 0;
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
                // Renderiza o badge apenas se o valor do filtro não for vazio/nulo
                value !== null &&
                value !== undefined &&
                value !== "" &&
                (!Array.isArray(value) || value.length > 0) && (
                  <Badge
                    key={field}
                    variant="secondary"
                    className="flex items-center gap-1 pl-2 pr-1 py-1" // Ajuste de padding
                  >
                    <span className="text-sm font-normal">
                      {filterLabels[field] || field}:{" "}
                      {formatFilterValue(field, value)}
                    </span>
                    {/* Botão para remover filtro individual */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-5 w-5 hover:bg-destructive/20 rounded-full" // Ajuste de estilo
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
            {/* Badge para Filiais Selecionadas */}
            {filials.length > 0 && (
              <Badge variant="secondary" className="text-sm font-normal">
                {filials.length}{" "}
                {filials.length === 1
                  ? "filial selecionada"
                  : "filiais selecionadas"}
              </Badge>
            )}
            {/* Botão Limpar Todos (Filtros e Filiais) */}
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
            {/* Botão Resetar Ordenação (NOVO) */}
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
          <DataTableFilterModal />
        </div>

        {/* Tabela de Dados */}
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={authLoading || isLoading} // Combina loading da autenticação e dos dados
          className="w-full backdrop-blur-2xl bg-card/60 rounded-xl border" // Adiciona borda sutil
        >
          {/* Paginação da Tabela */}
          <DataTablePagination />
        </DataTable>
      </div>
    </div>
  );
}
