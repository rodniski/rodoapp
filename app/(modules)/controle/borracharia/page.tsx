"use client";

import { useEffect } from "react";
import { Background } from "@/_core/components";
import { DataTable, DataTablePagination, useDataTableStore } from "@/_core/components/ui/data-table";
import { useMovPortaria } from "@/app/(modules)/controle/borracharia/_lib/hooks";
import { columnsBorracharia } from "./_lib/components/borColumns";

export default function ControlePage() {
  const {
    pageIndex,
    pageSize,
    setPagination
  } = useDataTableStore();

  const { data, isLoading } = useMovPortaria({ type: "borracharia", page: pageIndex + 1, pageSize });

  useEffect(() => {
    if (!data) return;

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
  }, [data?.pagination, setPagination]);


  return (
    <div className="flex flex-col items-center justify-center !max-h-[calc(100vh-60px)] p-4">
      {/* Fundo */}
      <Background />
      {/* Container */}
      <div className="relative flex flex-col h-full w-full p-6">
        <h1 className="text-4xl my-1">
          Central de Carregamento de Pneus      
        </h1>
        {/* Botão para Abrir Modal de Filtros */}
        {/* <DataTableFilterModal aria-label="Abrir modal de filtros" /> */}
        {/* Tabela de dados */}
        <DataTable
          columns={columnsBorracharia}
          data={data || []}
          isLoading={isLoading} 
          enableSorting={true}
          sortingConfig={{ allowMultiSort: false }}
          className="w-full backdrop-blur-2xl bg-card/60 rounded-xl border"
        >
          <DataTablePagination />
        </DataTable>
      </div>
    </div>
  );
}
