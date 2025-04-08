// Ex: app/prenotas/columns.tsx

"use client";

import type {ColumnDef} from "@tanstack/react-table";

// Componentes específicos de UI (ajuste os paths)
import {FilialHoverCard, PriorityBadge, VencimentoBadge} from ".";
import {Actions} from "./actions";
import {StatusBadge} from "#/dashboard/components/datatable/status"; // Ajuste o path
// Tipo de dados da tabela
import type {PrenotaTableData} from "!/app/actions/prenotaActions"; // Ajuste o path
// Helpers
import {formatCurrency} from "lib";

// Formata data YYYYMMDD -> DD/MM/YYYY para exibição
const formatDateForCell = (dateString: string | undefined | null): string => {
    if (!dateString || dateString.length !== 8 || !/^\d{8}$/.test(dateString)) {
        return "-";
    }
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${day}/${month}/${year}`;
};

// Componente interno para célula de Nota Fiscal
const NotaFiscalCell = ({doc, serie, dataEmissao}: { doc: string; serie: string; dataEmissao: string }) => (
    <div className="flex flex-col">
        <span className={"text-xs uw:text-base"}>{`${doc || '-'} / ${serie || '-'}`}</span>
        <span className="text-muted-foreground text-xs uw:text-base">
            Emitido: {formatDateForCell(dataEmissao)}
        </span>
    </div>
);


// --- Definições das Colunas ---
export const columns: ColumnDef<PrenotaTableData>[] = [
    {
        accessorKey: "f1_filial",
        header: "Filial",
        cell: ({row}) => (
            // Exibe informações da filial e usuário via HoverCard
            <FilialHoverCard
                filialNumero={row.original.f1_filial}
                observation={row.original.f1_xobs}
                username={row.original.usuario} // Exibe usuário extraído do F1_USERLGI
            />
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
        enableSorting: true,
        meta: {width: "60px"}, // Largura fixa
    },
    {
        accessorKey: "f1_xtipo",
        header: "Tipo",
        cell: ({row}) => (
            <div className="capitalize text-xs uw:text-base">
                {row.getValue("f1_xtipo")}
                {/* Usuário Protheus que incluiu */}
                <div className="text-xs uw:text-base text-muted-foreground">{row.original.f1_xusrra}</div>
            </div>
        ),
        // Filtro busca em Tipo e Usuário Protheus
        filterFn: (row, id, filterValue) => {
            const tipo = row.getValue("f1_xtipo")?.toString().toLowerCase() || "";
            const usuario = row.original.f1_xusrra?.toString().toLowerCase() || "";
            const checkValue = (val: unknown) => {
                const search = String(val).toLowerCase();
                return tipo.includes(search) || usuario.includes(search);
            }
            return Array.isArray(filterValue) ? filterValue.some(checkValue) : checkValue(filterValue);
        },
        meta: {width: "120px"},
    },
    {
        id: "documento", // ID customizado para coluna computada
        header: "Nota Fiscal",
        cell: ({row}) => (
            <NotaFiscalCell
                doc={row.original.f1_doc}
                serie={row.original.f1_serie}
                dataEmissao={row.original.f1_emissao}
            />
        ),
        enableSorting: false, // Coluna computada não ordenável por padrão
        meta: {width: "120px"},
    },
    {
        accessorKey: "fornece", // Campo concatenado (Cod + Loja + Nome)
        header: "Fornecedor",
        cell: ({row}) => <span className={"text-xs uw:text-base truncate"}>{row.getValue("fornece")}</span>,
        enableSorting: true,
        meta: {width: "220px"},
    },
    {
        accessorKey: "f1_dtdigit_unix", // Ordena pelo timestamp UNIX para precisão
        header: "Inclusão",
        cell: ({row}) => (
            // Exibe a data formatada (YYYYMMDD -> DD/MM/YYYY)
            <span className={"text-xs uw:text-base"}>{formatDateForCell(row.original.f1_dtdigit)}</span>
        ),
        enableSorting: true,
        meta: {width: "80px"},
    },
    {
        accessorKey: "vencimento", // Data YYYYMMDD
        header: "Vencimento",
        cell: ({row}) => (
            // Componente VencimentoBadge deve tratar o formato YYYYMMDD
            <VencimentoBadge vencimento={row.original.vencimento}/>
        ),
        enableSorting: true, // Ordenação de string YYYYMMDD funciona
        meta: {width: "90px"},
    },
    {
        accessorKey: "f1_valbrut", // Campo numérico
        header: "Valor (R$)",
        cell: ({row}) => (
            // Formata e alinha o valor à direita
            <span className="text-xs uw:text-base text-right block">{formatCurrency(row.getValue("f1_valbrut"))}</span>
        ),
        enableSorting: true,
        meta: {className: "text-right", width: "100px"}, // Alinhamento via classe
    },
    {
        accessorKey: "f1_xprior",
        header: "Prioridade",
        cell: ({row}) => <PriorityBadge priority={row.original.f1_xprior}/>,
        filterFn: (row, id, value) => value.includes(row.getValue(id)), // Filtro simples de inclusão
        enableSorting: true,
        meta: {width: "90px"},
    },
    {
        id: "derivedStatus",
        header: "Status",
        cell: ({row}) => (
            // Passa o objeto prenota completo para o StatusBadge
            <StatusBadge prenota={row.original}/>
        ),
        // Ordenação e filtragem baseadas em status derivado são mais complexas
        // É mais simples desabilitá-las ou filtrar/ordenar pelos campos originais (f1_status, f1_xrev)
        // se necessário, usando a configuração da tabela ou filtros externos.
        enableSorting: false,
        enableFiltering: false,
        meta: {
            className: "text-center", // Centraliza conteúdo da célula se necessário
            width: "60px", // Mantém largura
        },
    },
    // Coluna de Anexo foi removida pois 'AnexoPath' não existe nos dados do Redis.
    {
        id: "actions",
        cell: ({row}) => {
            // Passa o objeto PrenotaTableData completo para o componente Actions
            // Garanta que o componente Actions aceite este tipo.
            return <Actions preNota={row.original}/>
        },
        meta: {width: "50px"}, // Largura fixa para ações
        enableSorting: false,
        enableHiding: false,
    },
];