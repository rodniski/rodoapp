"use client";

import React, { useEffect } from "react";
import { useBreadcrumbs } from "lib";
import { useMovPortaria } from "@/hooks";
import { ConfColumns } from "@/components";
import { DataTable } from "ui/data-table";
import { ScrollArea } from "$/components/ui";

const Page = () => {
  const { setBreadcrumbs } = useBreadcrumbs();

  const { data, isLoading } = useMovPortaria({
    type: "portaria",
  });

  useEffect(() => {
    setBreadcrumbs([
      { label: "RodoApp", href: "/central" },
      { label: "Controle de Saída", href: "/central/lancamento" },
      { label: "Conferência" },
    ]);
  }, [setBreadcrumbs]);

  return (
    <ScrollArea className="h-[calc(100vh-60px)]">
      <div className="flex flex-col h-full p-6">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Central de Carregamento de Pneus
        </h1>
        <DataTable
          columns={ConfColumns}
          data={data || []}
          isLoading={isLoading}
        />
      </div>
    </ScrollArea>
  );
};

export default Page;
