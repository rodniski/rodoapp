"use client";

import { useMovPortaria } from "./_lib/hooks";
import { ConfColumns } from "./_lib/components/ConfColumns";
import { DataTable, ScrollArea } from "ui";
import { BorPagination, DataTableFilterModal } from "@borracharia/components";
import { usePortariaTableStore } from "@portaria/stores";

const Page = () => {
  const { 
      pageIndex = 0, 
      pageSize = 100, 
      filters = {}
  } = usePortariaTableStore();

  const { data, isLoading } = useMovPortaria({
    page: pageIndex + 1, pageSize, filial: "0101", conferido: "N",filters: filters
  });

  return (
    <ScrollArea className="h-[calc(100vh-60px)]">
      <div className="flex flex-col h-full p-6">
        <h1 className="text-4xl font-bold mb-6 text-center flex justify-between">
          Carregamento de Pneus - Portaria
          <div className="mx-2 text-2xl">
            <DataTableFilterModal selectPage="portaria" aria-label="Abrir modal de filtros" />
          </div>
        </h1>
        <DataTable
          columns={ConfColumns}
          data={data || []}
          isLoading={isLoading}
        >
          <BorPagination dataLength={data?.length || 0} selectPage="portaria"/>
        </DataTable>
      </div>
    </ScrollArea>
  );
};

export default Page;
