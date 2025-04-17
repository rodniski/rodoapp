"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import {
  DataTable,
  DataTablePagination,
  useDataTableStore,
} from "ui/data-table";
import { columns, DataTableFilterModal } from "@prenota/components";
import { usePrenotas } from "@prenota/hooks";

import { useFiliaisStore } from "stores";
import { Background } from "comp";

export default function PrenotaPage() {
  const pageIndex = useDataTableStore((s) => s.pageIndex);
  const pageSize = useDataTableStore((s) => s.pageSize);
  const filters = useDataTableStore((s) => s.filters);
  const sorting = useDataTableStore((s) => s.sorting);
  const setPagination = useDataTableStore((s) => s.setPagination);

  const { filiais, filiaisLoading, fetchFiliais } = useFiliaisStore();

  const { data, isLoading, isError, error, isSuccess } = usePrenotas({
    page: pageIndex + 1,
    pageSize,
    filters,
    sorting,
    filials: filiais.map((f) => f.numero),
  });

  useEffect(() => {
    toast.promise(fetchFiliais(), {
      loading: "Carregando filiais...",
      success: "Filiais carregadas com sucesso",
      error: "Erro ao carregar filiais",
    });
  }, [fetchFiliais]);

  useEffect(() => {
    if (data?.pagination) {
      setPagination(data.pagination);
    }
  }, [data, setPagination]);

  useEffect(() => {
    if (isError && error) {
      toast.error("Erro ao buscar pré-notas", {
        description: error.message,
        duration: 5000,
      });
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess && data?.data?.length) {
      toast.success(`Pré-notas carregadas (${data.data.length})`);
    }
  }, [isSuccess, data]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-66px)] overflow-hidden p-4">
      <Background />
      <div className="z-10 w-full h-full p-4 lg:p-8 qhd:p-12 flex flex-col gap-4">
        <div className="flex justify-end w-full">
          <DataTableFilterModal />
        </div>
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={filiaisLoading || isLoading}
          className="w-full backdrop-blur-2xl bg-card/60"
        >
          <DataTablePagination />
        </DataTable>
      </div>
    </div>
  );
}
