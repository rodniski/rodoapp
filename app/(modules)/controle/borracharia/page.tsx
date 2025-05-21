"use client";

import { Background } from "ui";
import { DataTable, Tabs, TabsContent, TabsList, TabsTrigger } from "ui";
import { useMovBorracharia } from "@borracharia/hooks";
import { BorPagination, columnsBorracharia } from "@borracharia/components";
import { DataTableFilterModal } from "@borracharia/components/filtro";
import { useBorrachariaTableStore } from "@borracharia/stores/useBorrachariaTableStore";
import { useMovPortaria } from "@portaria/hooks";
import { borHistColumns } from "@borracharia/components";

export default function ControlePage() {
  const {
    pageIndex = 0,
    pageSize = 100,
    filters = {}
  } = useBorrachariaTableStore();

  const { data, isLoading, refetch } = useMovBorracharia({ Page: pageIndex + 1, PageSize: pageSize, Filial: "0101", Filters: filters });
  const { data : dataHist, isLoading : isLoadingHist, refetch : refetchHist } = useMovPortaria({ page: 1, pageSize: 100, filial: "0101", conferido: "N" });

  return (
    <div className="flex flex-col items-center justify-center !max-h-[calc(100vh-80px)] p-4">
      {/* Fundo */}
      <Background />
      {/* Container */}
      <div className="relative flex flex-col h-full w-full p-6">
        <Tabs defaultValue="pedidos" className="w-full mt-4" onValueChange={(tab) => {
          if (tab === "movimentacoes") {
            refetchHist();
          }
          if (tab === "pedidos") {
            refetch();
          }
        }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex">
              <h1 className="text-4xl font-bold">Carregamento de Pneus - Borracharia</h1>
              <div className="flex items-center space-x-4 mx-3">
                <TabsList className="flex border rounded-md overflow-hidden">
                  <TabsTrigger value="movimentacoes" className="px-4 py-2 data-[state=active]:bg-muted cursor-pointer">
                    Movimentações
                  </TabsTrigger>
                  <TabsTrigger value="pedidos" className="px-4 py-2 data-[state=active]:bg-muted cursor-pointer">
                    "Pedidos"
                  </TabsTrigger>
                </TabsList>
              </div>       
            </div>
            <DataTableFilterModal selectPage="borracharia" aria-label="Abrir modal de filtros" />
          </div>

          <TabsContent value="movimentacoes">
            <DataTable
              columns={borHistColumns}
              data={dataHist || []}
              isLoading={isLoadingHist}
              enableSorting
              className="w-full backdrop-blur-2xl bg-card/60 rounded-xl border"
            >
              <BorPagination dataLength={data?.length || 0} selectPage="portaria" />
            </DataTable>
          </TabsContent>

          <TabsContent value="pedidos">
            <DataTable
              columns={columnsBorracharia}
              data={data || []}
              isLoading={isLoading}
              enableSorting
              className="w-full backdrop-blur-2xl bg-card/60 rounded-xl border"
            >
              <BorPagination dataLength={data?.length} selectPage="borracharia" />
            </DataTable>
          </TabsContent>
        </Tabs>
      </div>
    </div>

  );
}
