"use client";

import { useMovPortaria } from "./_internal/hooks";
import { ConfColumns } from "./_internal/components/ConfColumns";
import { DataTable } from "ui";
import { ScrollArea } from "ui";

const Page = () => {
  const { data, isLoading } = useMovPortaria({
    type: "portaria",
  });

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
