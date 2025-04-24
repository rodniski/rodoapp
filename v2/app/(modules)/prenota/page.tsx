// @(modules)/prenota/page.tsx
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
import { useAuthStore } from "@login/stores/auth-store"; // Importa o auth store
import { Background } from "comp";
import { FilialAcesso } from "@login/types";
import { useState } from "react";

export default function PrenotaPage() {
  const pageIndex = useDataTableStore((s) => s.pageIndex);
  const pageSize = useDataTableStore((s) => s.pageSize);
  const filters = useDataTableStore((s) => s.filters);
  const sorting = useDataTableStore((s) => s.sorting);
  const setPagination = useDataTableStore((s) => s.setPagination);

  // Estado local para armazenar filiais e authLoading
  const [filiais, setFiliais] = useState<FilialAcesso[]>([]);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Carrega os dados do useAuthStore apenas no cliente
  useEffect(() => {
    const { filiais, isLoading } = useAuthStore.getState();
    setFiliais(filiais);
    setAuthLoading(isLoading);

    // Opcional: Assina mudanças no store para atualizar o estado local
    const unsubscribe = useAuthStore.subscribe((state) => {
      setFiliais(state.filiais);
      setAuthLoading(state.isLoading);
    });

    return () => unsubscribe(); // Limpa a assinatura ao desmontar o componente
  }, []);

  const { data, isLoading, isError, error, isSuccess } = usePrenotas({
    page: pageIndex + 1,
    pageSize,
    sorting,
    filials: filiais.map((f) => f.M0_CODFIL), // Ajustado para usar M0_CODFIL conforme a interface FilialAcesso
  });

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
        <DataTable
          columns={columns}
          data={data?.data || []}
          isLoading={authLoading || isLoading} // Combina o carregamento do auth e do usePrenotas
          className="w-full backdrop-blur-2xl bg-card/60"
        >
          <DataTablePagination />
        </DataTable>
      </div>
    </div>
  );
}
