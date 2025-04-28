import React from "react";
import { xmlColumns as columns } from ".";
import { usePreNotaStore } from "@inclusao/stores";
import { InclusaoTable } from "./inclusao-table";
export function Tabela() {
  const itens = usePreNotaStore((state) => state.draft.itens);

  return (
    <div className="w-full flex-1 p-5">
      <InclusaoTable columns={columns} data={itens} />
    </div>
  );
}
