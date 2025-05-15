"use client";

import { Background } from "@/_core/components";
import { DataTable, useDataTableStore } from "@/_core/components/ui/data-table";
import { BorPagination } from "./_internal/components/borPagination";
import { useMovBorracharia } from "@borracharia/hooks";
import { columnsBorracharia } from "./_internal/components/borColumns";
import { DataTableFilterModal } from "./_internal/components/filtro/filters";

export default function ControlePage() {
  const {
    pageIndex,
    pageSize,
    filters
  } = useDataTableStore();

  const { data, isLoading } = useMovBorracharia({ type: "borracharia", page: pageIndex + 1, pageSize, filters });

  return (
    <div className="flex flex-col items-center justify-center !max-h-[calc(100vh-60px)] p-4">
      {/* Fundo */}
      <Background />
      {/* Container */}
      <div className="relative flex flex-col h-full w-full p-6">
        <h1 className="text-4xl my-1 flex items-center justify-between">
          Central de Carregamento de Pneus           
          {/* Botão para Abrir Modal de Filtros */}
          <div className="mx-2 text-2xl">
            <DataTableFilterModal aria-label="Abrir modal de filtros" />
          </div>
        </h1>
        {/* Tabela de dados */}
        <DataTable
          columns={columnsBorracharia}
          data={data || []}
          isLoading={isLoading} 
          enableSorting={true}
          sortingConfig={{ allowMultiSort: false }}
          className="w-full backdrop-blur-2xl bg-card/60 rounded-xl border"
        >
          <BorPagination dataLength={data?.length} />
        </DataTable>
      </div>
    </div>
  );
}
