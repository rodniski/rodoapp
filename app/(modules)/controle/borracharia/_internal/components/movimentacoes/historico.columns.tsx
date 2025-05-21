import { ColumnDef } from "@tanstack/react-table";
import { PortariaItem } from "@portaria/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "ui";
import { BorHistEstorno } from "@borracharia/components";

export const borHistColumns: ColumnDef<PortariaItem>[] = [
  {
    accessorKey: "NFLabel",
    header: "NF",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("NFLabel")}</div>
    ),
  },
  {
    accessorKey: "Data",
    header: "Data/Hora",
    cell: ({ row }) => {
      const hora = row.original.Hora;
      return (
        <div>
          <div>{row.original.Data}</div>
          <div className="text-sm text-muted-foreground">{hora}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "DescCliente",
    header: "Cliente",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="max-w-[300px] truncate">
          {row.getValue("DescCliente")}
        </div>
        <div className="text-xs text-muted-foreground">
          Cód: {row.original.CodCliente}-{row.original.Loja}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "ProdutoDesc",
    header: "Produto",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="max-w-[300px] truncate">
          {row.getValue("ProdutoDesc")}
        </div>
        <div className="text-xs text-muted-foreground">
          Item: {row.original.ProdutoItem}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "QtdEntregue",
    header: "Entregue / Saldo",
    cell: ({ row }) => (
      <div className="text-center space-x-1">
        <span className="font-medium text-lg">
          {row.getValue("QtdEntregue")}
        </span>
        <span className="text-muted-foreground">/</span>
        <span
          className={`text-sm ${
            row.original.Saldo < 0 ? "text-red-500" : "text-green-500"
          }`}
        >
          {row.original.Saldo}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "PlacaResp",
    header: "Placa / Retirada",
    cell: ({ row }) => (
      <>
        <Tooltip>
          <TooltipTrigger className="text-start">
            <div className="uppercase truncate w-42">
              Retirado por: {row.original.RespRet}
            </div>

            <span className="text-xs text-muted-foreground">
              Placa: {row.original.Placa}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            {row.original.Retirado === "R" ? "Rodoparaná" : "Cliente"}
          </TooltipContent>
        </Tooltip>
      </>
    ),
  },
  {
    accessorKey: "CarregadorObs",
    header: "Carregador / Observações",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <div className="max-w-[200px] truncate" title={row.original.Obs}>
          {row.original.Obs}
        </div>
        <div className="text-xs text-muted-foreground">
          Carregado por: {row.original.RespCarreg}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "Actions",
    header: "Ações",
    cell: ({ row }) => (
      <div className="w-[100px]">
        <BorHistEstorno item={row.original} />
      </div>
    ),
  },
];
