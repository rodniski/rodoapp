import React from "react";
import { columns } from ".";
import { usePreNotaStore } from "@inclusao/stores";
import { InclusaoTable } from "./inclusao-table";
export function Tabela() {
  const itens = usePreNotaStore((state) => state.draft.itens);

  return (
    <div className="w-full flex-1 pt-[120px]">
      <InclusaoTable columns={columns} data={itens} />
    </div>
  );
}
