"use client";

import { HistColumns } from "./_lib/components";
import { useHistory } from "./_lib/hooks";
import { DataTable, ScrollArea } from "ui";

const Page = () => {
  const { data, isLoading } = useHistory({
    Page: '1',
    Filial: "0101"
  });

  return (
    <ScrollArea className="h-[calc(100vh-60px)]">
      <div className="flex flex-col h-full p-6">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Central de Carregamento de Pneus
        </h1>
        <DataTable
          columns={HistColumns}
          data={data || []}
          isLoading={isLoading}
        />
      </div>
    </ScrollArea>
  );
};

export default Page;
