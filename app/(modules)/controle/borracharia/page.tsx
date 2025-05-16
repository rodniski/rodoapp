"use client";

import { Background } from "@/_core/components";
import { DataTable } from "ui";
import { BorPagination } from "./_lib/components/borPagination";
import { useMovBorracharia } from "@borracharia/hooks";
import { columnsBorracharia } from "@borracharia/components/borColumns";
import { DataTableFilterModal } from "@borracharia/components/filtro/filters";
import { useBorrachariaTableStore } from "@borracharia/stores/useBorrachariaTableStore";

export default function ControlePage() {
  const {
    pageIndex = 0,
    pageSize = 100,
    filters = {}
  } = useBorrachariaTableStore();

  const { data, isLoading } = useMovBorracharia({ Page: pageIndex + 1, PageSize: pageSize, Filial: "0101", Filters: filters });

  return (
    <div className="flex flex-col items-center justify-center !max-h-[calc(100vh-60px)] p-4">
      {/* Fundo */}
      <Background />
      {/* Container */}
      <div className="relative flex flex-col h-full w-full p-6">
        <h1 className="text-4xl font-bold mb-6 flex items-center justify-between">
          Carregamento de Pneus - Borracharia          
          {/* Botão para Abrir Modal de Filtros */}
          <div className="mx-2 text-2xl">
            <DataTableFilterModal selectPage="borracharia" aria-label="Abrir modal de filtros" />
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
          <BorPagination dataLength={data?.length} selectPage="borracharia"/>
        </DataTable>
      </div>
    </div>
  );
}
