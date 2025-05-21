"use client";

import { HistColumns } from "@controle/components";
import { useMovHistorico } from "@controle/hooks";
import { DataTable, ScrollArea } from "ui";
import { BorPagination, DataTableFilterModal } from "@borracharia/components";
import { useHistoricoTableStore } from "@controle/stores";

const Page = () => {
  const { 
    pageIndex = 0, 
    pageSize = 100, 
    filters = {}
  } = useHistoricoTableStore();

  const shouldFetch = pageIndex !== undefined && pageSize !== undefined;
  const { data, isLoading } = useMovHistorico({ page: pageIndex + 1, pageSize, filial: "0101", filters: filters, enabled: shouldFetch }) || [];

  // Logs de carregamento
  console.log("🟢 useMovHistorico result:", { data: data });

  return (
    <ScrollArea className="h-[calc(100vh-60px)]">
      <div className="flex flex-col h-full p-6">
        <h1 className="text-4xl font-bold mb-6 text-center flex justify-between">
          Carregamento de Pneus - Histórico de Conferência
          <div className="mx-2 text-2xl">
            <DataTableFilterModal selectPage="historico" aria-label="Abrir modal de filtros" />
          </div>
        </h1>
        <DataTable
          columns={HistColumns}
          data={data || []}
          isLoading={isLoading}
        >
          <BorPagination dataLength={data?.length || 0} selectPage="historico"/>
        </DataTable>
      </div>
    </ScrollArea>
  );
};

export default Page;
