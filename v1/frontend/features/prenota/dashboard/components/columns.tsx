// Exemplo de como definir as colunas com larguras específicas
import type {ColumnDef} from "@tanstack/react-table"
import {AnexoDownload, FilialHoverCard, PriorityBadge, VencimentoBadge} from "."
import {Actions} from "./actions"
import {StatusBadge} from "#/dashboard/components/datatable/status"
import type {PreNota} from "#/dashboard/interfaces"
import {formatCurrency} from "lib"

// Componentes de célula extraídos para melhorar a organização
const NotaFiscalCell = ({doc, serie, dataEmissao}: { doc: string; serie: string; dataEmissao: string }) => (
    <div className="flex flex-col">
        <span className={"text-xs uw:text-base"}>{`${doc} - ${serie}`}</span>
        <span className="text-muted-foreground text-xs uw:text-base">Emitido: {dataEmissao}</span>
    </div>
)

export const columns: ColumnDef<PreNota>[] = [
    {
        accessorKey: "F1Filial",
        header: "Filial",
        cell: ({row}) => (
            <FilialHoverCard
                filialNumero={row.original.F1Filial}
                observation={row.original.F1XObs}
                username={row.original.AnexoPath}
            />
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
        enableSorting: true,
        meta: {
            className: "whitespace-nowrap",
            width: "60px", // Largura explícita
        },
    },
    {
        accessorKey: "F1XTipo",
        header: "Tipo",
        cell: ({row}) => (
            <div className="capitalize text-xs uw:text-base">
                {row.getValue("F1XTipo")}
                <div className="text-xs uw:text-base text-muted-foreground">{row.original.F1XUsrra}</div>
            </div>
        ),
        filterFn: (row, id, filterValue) => {
            const tipo = row.getValue("F1XTipo")?.toString().toLowerCase() || ""
            const usuario = row.original.F1XUsrra?.toString().toLowerCase() || ""

            if (Array.isArray(filterValue)) {
                return filterValue.some((val) => {
                    const search = val.toString().toLowerCase()
                    return tipo.includes(search) || usuario.includes(search)
                })
            } else if (typeof filterValue === "string") {
                const search = filterValue.toLowerCase()
                return tipo.includes(search) || usuario.includes(search)
            }
            return false
        },
        meta: {
            className: "whitespace-nowrap",
            width: "120px",
        },
    },
    {
        accessorKey: "F1Doc",
        header: "Nota Fiscal",
        cell: ({row}) => (
            <NotaFiscalCell doc={row.original.F1Doc} serie={row.original.F1Serie} dataEmissao={row.original.F1Emissao}/>
        ),
        meta: {
            className: "whitespace-nowrap",
            width: "120px",
        },
    },
    {
        accessorKey: "Fornece",
        header: "Fornecedor",
        cell: ({row}) => <span className={"text-xs uw:text-base"}>{row.getValue("Fornece")}</span>,
        meta: {
            className: "whitespace-nowrap",
            width: "220px",
        },
    },
    {
        accessorKey: "F1DtDigit",
        header: "Inclusão",
        cell: ({row}) => (
            <span className={"text-xs uw:text-base"}>{row.original.F1DtDigit}</span>
        ),
        sortingFn: (rowA, rowB, columnId) => {
            const dateA = new Date(rowA.original.F1DtDigit.split('/').reverse().join('-'));
            const dateB = new Date(rowB.original.F1DtDigit.split('/').reverse().join('-'));
            return dateA.getTime() - dateB.getTime();
        },
        meta: {
            className: "whitespace-nowrap",
            width: "80px",
        },
    },
    {
        accessorKey: "Vencimento",
        header: "Vencimento",
        cell: ({row}) => (
            <div>
                <VencimentoBadge vencimento={row.original.Vencimento}/>
            </div>
        ),
        sortingFn: (rowA, rowB, columnId) => {
            const dateA = new Date(rowA.original.Vencimento.split('/').reverse().join('-'));
            const dateB = new Date(rowB.original.Vencimento.split('/').reverse().join('-'));
            return dateA.getTime() - dateB.getTime();
        },
        meta:
            {
                className: "whitespace-nowrap",
                width:
                    "90px",
            }
        ,
    },
    {
        accessorKey: "F1ValBrut",
        header: "Valor (R$)",
        cell: ({row}) => (
            <span className="text-xs uw:text-base">
                {formatCurrency(row.getValue("F1ValBrut"))}
            </span>
        ),
        sortingFn: "basic",
        meta: {
            className: "whitespace-nowrap",
            width: "100px",
        },
    },
    {
        accessorKey: "F1XPrior",
        header:
            "Prioridade",
        cell:
            ({row}) => <PriorityBadge priority={row.original.F1XPrior}/>,
        filterFn:
            (row, id, value) => value.includes(row.getValue(id)),
        meta:
            {
                className: "whitespace-nowrap",
                width:
                    "90px",
            }
        ,
    }
    ,
    {
        accessorKey: "F1Status",
        header:
            "Status",
        cell:
            ({row}) => <StatusBadge status={row.getValue("F1Status")}/>,
        filterFn:
            (row, id, filterValue) => {
                const status = row.getValue(id)?.toString() || "";
                return Array.isArray(filterValue) ? filterValue.includes(status) : false;
            },
        meta:
            {
                className: "whitespace-nowrap",
                width:
                    "60px",
            }
        ,
    }
    ,
    {
        accessorKey: "Anexo",
        header:
            "Anexos",
        cell:
            ({row}) => (
                <AnexoDownload AnexoPath={row.original.AnexoPath}/>
            ),
        meta:
            {
                className: "whitespace-nowrap",
                width:
                    "60px",
            }
        ,
    }
    ,
    {
        id: "actions",
        cell:
            ({row}) => {
                const nota = row.original
                return <Actions preNota={nota}/>
            },
        meta:
            {
                className: "w-[80px]",
                width:
                    "50px",
            }
        ,
    }
    ,
]

