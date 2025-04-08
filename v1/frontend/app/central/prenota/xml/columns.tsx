// columns.ts
import {ColumnDef} from "@tanstack/react-table";
import {ProdutoCombobox} from "#/incluir/components/xml";
import {formatCurrency} from "lib";
import {MappedProduto} from "#/incluir/interfaces";

export const xmlColumns: ColumnDef<MappedProduto>[] = [
    {
        header: "Dados da XML",
        columns: [
            {
                // “Subcoluna” que unifica ITEM, PRODFOR e DESCFOR
                header: "Produto (XML)",
                cell: ({row}) => {
                    const {ITEM, PRODFOR, DESCFOR} = row.original;
                    return (
                        <div className="flex flex-col items-start text-start">
                            <span className="text-xs">
                            Item: <strong>{ITEM}</strong> - Cod: <strong>{PRODFOR}</strong>
                            </span>
                            <strong className="text-sm">{DESCFOR}</strong>
                        </div>
                    );
                },
            },
            {
                accessorKey: "ORIGEMXML",
                header: "Origem XML",
            },
            {
                accessorKey: "QUANTIDADE",
                header: "Quantidade (XML)",
            },
            {
                accessorKey: "VALUNIT",
                header: "Vlr Unit (XML)",
                cell: (info) => formatCurrency(info.getValue()),
            },
            {
                accessorKey: "TOTAL",
                header: "Total (XML)",
                cell: (info) => formatCurrency(info.getValue()),
            },
        ],
    },
    {
        header: "Dados do Pedido",
        columns: [
            {
                accessorKey: "PRODUTO",
                header: "Produto",
                cell: ({row}) => {
                    const original = row.original;
                    return (
                        <ProdutoCombobox
                            selectedValue={original.selectedProduto || null}
                            xmlItem={original}
                        />
                    );
                },
            },
            {
                accessorKey: "ORIGEM",
                header: "Origem",
            },
            {
                accessorKey: "B1_UM",
                header: "U.Medida / 2a UM",
                cell: ({row}) => {
                    const {B1_UM, SEGUN} = row.original;
                    return (
                        <span className="text-sm">
                            {`${B1_UM}${SEGUN ? ` / ${SEGUN}` : ""}`}
                        </span>
                    );
                },
            },
            {
                accessorKey: "TPFATO",
                header: "TPFATO",
            },
            {
                accessorKey: "CONV",
                header: "CONV",
            },
        ],
    },
];
