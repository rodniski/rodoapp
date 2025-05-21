import { ColumnDef } from "@tanstack/react-table";
import { BorrachariaItem } from "@borracharia/types";
import BorDeliver from "./borDelivery";

export const columnsBorracharia: ColumnDef<BorrachariaItem>[] = [
  {
      accessorKey: "NFLabel",
      header: "Nota Fiscal",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.getValue("NFLabel")}</span>
          <span className="text-xs text-muted-foreground">
            Filial: {row.original.Filial}
          </span>
        </div>
      ),
    },
    {   
      accessorKey: "VendLabel",
      header: "Vendedor",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold truncate">{row.getValue("VendLabel")}</span>
          <span className="text-xs text-muted-foreground">
            Cód: {row.original.CodVendedor}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "ClienteLabel",
      header: "Cliente",
      cell: ({ row }) => (
        <div className="flex flex-col w-full">
          <span className="truncate">{row.getValue("ClienteLabel")}</span>
          <span className="text-xs text-muted-foreground">
            Cód: {row.original.CodCliente}-{row.original.Loja}
          </span>
        </div>
      ),
      size: 300,
    },
    {
      accessorKey: "Emissao",
      header: "Emissão",
      cell: ({ row }) => {
        const dateStr = row.getValue<string>("Emissao");
        const dateParts = dateStr.split("/");

        if (dateParts.length === 3) {
          const [day, month, year] = dateParts;
          return `${day}-${month}-${year}`;
        }

        return dateStr || "Data Inválida";
      },
    },
    {
      accessorKey: "QtdItens",
      header: "Itens da NF",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("QtdItens")}</span>
      ),
    },
    {
      accessorKey: "Actions",
      header: "Entregar Pneus",
      cell: ({ row }) => (
        <div className="w-[100px]">
          <BorDeliver item={row.original} />
        </div>
      ),
    },
]
