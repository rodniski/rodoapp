// Ex: components/datatable/toolbar.tsx (ou seu path)
"use client";

import * as React from "react";
import { useAtomValue } from "jotai";
import { AnimatePresence, motion } from "framer-motion";
import type { Table } from "@tanstack/react-table";
import { toast } from "sonner"; // Importa o toast do sonner
import { MultiSelectFilter } from "./multi-select-filter";
import { FileSpreadsheet,RefreshCw, X } from "lucide-react";
import { Button, Input } from "ui";

// Imports de tipos e opções (ajuste os paths)
import { accessFiliaisAtom } from "atoms";
import { TIPOS_NF_OPTIONS } from "#/dashboard/interfaces";

interface OptionType {
    label: string;
    value: string;
}

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    globalFilter: string;
    setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
    onExport?: () => void | Promise<any>; // Export pode ser sync ou async
    onRefetch?: () => Promise<any>; // onRefetch de useQuery retorna Promise
    hasSelection?: boolean;
    isRefetching?: boolean; // Mantido para desabilitar/animar botão de refresh
}

export function DataTableToolbar<TData>({
                                            table,
                                            globalFilter,
                                            setGlobalFilter,
                                            onExport,
                                            onRefetch,
                                            hasSelection = false,
                                            isRefetching = false,
                                        }: DataTableToolbarProps<TData>) {
    const filiais = useAtomValue(accessFiliaisAtom);
    const isFiltered = table.getState().columnFilters.length > 0 || globalFilter !== "";
    const [showFilters, setShowFilters] = React.useState(false);
    // Estado 'isFiltering' removido, usaremos toast.promise

    // Estados locais para filtros (mantidos)
    const [localGlobalFilter, setLocalGlobalFilter] = React.useState(globalFilter);
    const [localFilialFilter, setLocalFilialFilter] = React.useState<string[]>(
        () => (table.getColumn("f1_filial")?.getFilterValue() as string[]) || []
    );
    const [localTipoNFFilter, setLocalTipoNFFilter] = React.useState<string[]>(
        () => (table.getColumn("f1_xtipo")?.getFilterValue() as string[]) || []
    );

    const filialOptions: OptionType[] = React.useMemo(() =>
        filiais.map((filial) => ({
            label: `${filial.M0_CODFIL} - ${filial.M0_FILIAL}`,
            value: filial.M0_CODFIL,
        })), [filiais]
    );

    // Função para aplicar filtros com toast.promise
    const applyFilters = React.useCallback(() => {
        // Cria uma Promise que aplica os filtros
        const filterPromise = new Promise<void>((resolve) => {
            // Aplica os filtros imediatamente (a ação é síncrona na tabela)
            table.getColumn("f1_filial")?.setFilterValue(localFilialFilter.length ? localFilialFilter : undefined);
            table.getColumn("f1_xtipo")?.setFilterValue(localTipoNFFilter.length ? localTipoNFFilter : undefined);
            setGlobalFilter(localGlobalFilter);
            // Resolve a promise (pode adicionar um delay mínimo se quiser simular trabalho)
            setTimeout(resolve, 100); // Pequeno delay opcional
        });

        // Mostra o toast
        toast.promise(filterPromise, {
            loading: "Aplicando filtros...",
            success: "Filtros aplicados!",
            error: "Erro ao aplicar filtros.", // Deve acontecer raramente aqui
        });

    }, [
        table,
        localFilialFilter,
        localTipoNFFilter,
        localGlobalFilter,
        setGlobalFilter,
    ]);

    // Função para limpar filtros com toast.promise
    const clearFilters = React.useCallback(() => {
        const clearPromise = new Promise<void>(resolve => {
            setLocalGlobalFilter("");
            setLocalFilialFilter([]);
            setLocalTipoNFFilter([]);
            table.resetColumnFilters();
            setGlobalFilter("");
            setTimeout(resolve, 100); // Pequeno delay opcional
        });

        toast.promise(clearPromise, {
            loading: "Limpando filtros...",
            success: "Filtros removidos!",
            error: "Erro ao limpar filtros.",
        });
    }, [table, setGlobalFilter]);

    // Função de exportação com toast.promise
    const handleExport = React.useCallback(() => {
        const exportPromise = new Promise(async (resolve, reject) => {
            try {
                if (onExport) {
                    // Se onExport for uma Promise, aguarda
                    await onExport();
                } else {
                    // Lógica CSV síncrona padrão
                    const rows = hasSelection ? table.getSelectedRowModel().rows : table.getFilteredRowModel().rows;
                    const headers = table.getAllLeafColumns()
                        .filter(col => col.getIsVisible() && col.id !== "actions" && col.id !== 'select')
                        .map(col => col.id);
                    const csvData = [
                        headers.join(","),
                        ...rows.map(row =>
                            headers.map(header => {
                                const value = row.getValue(header);
                                return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value;
                            }).join(",")
                        ),
                    ].join("\n");
                    const blob = new Blob([`\uFEFF${csvData}`], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.setAttribute("href", url);
                    link.setAttribute("download", "pre-notas.csv");
                    link.style.visibility = "hidden";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                resolve("Exportação concluída"); // Mensagem de sucesso interna
            } catch (err) {
                reject(err); // Rejeita em caso de erro
            }
        });

        toast.promise(exportPromise, {
            loading: "Exportando dados...",
            success: "Dados exportados com sucesso!",
            error: (err) => `Erro ao exportar: ${err instanceof Error ? err.message : 'Erro desconhecido'}`,
        });
    }, [table, onExport, hasSelection]);

    // Função de Refetch com toast.promise
    const handleRefetch = React.useCallback(() => {
        if (onRefetch) {
            // onRefetch (de useQuery) já retorna uma Promise
            toast.promise(onRefetch(), {
                loading: "Atualizando dados...",
                success: "Dados atualizados!",
                error: (err) => `Erro ao atualizar: ${err instanceof Error ? err.message : 'Erro desconhecido'}`,
            });
        }
    }, [onRefetch]);

    // Animação dos filtros (mantida)
    const filterVariants = { /* ... (igual antes) ... */ };
    const totalVisibleFilters = 3; // Global, Filial, Tipo NF

    return (
        <div className="flex items-center justify-between flex-wrap min-h-[56px] gap-y-2">
            {/* Botão de Filtro e Filtros */}
            <div className="flex items-center gap-2 flex-wrap">
                {/* Botão de toggle dos filtros (mantido) */}
                <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} aria-label={showFilters ? "Esconder filtros" : "Mostrar filtros"}>
                    <AnimatePresence mode="wait">{/* ... Animação do ícone ... */}</AnimatePresence>
                </Button>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div className="flex items-center gap-2 flex-wrap" initial="hidden" animate="visible" exit="exit">
                            {/* Filtro Global */}
                            <motion.div custom={{ index: 0, total: totalVisibleFilters }} variants={filterVariants} className="flex items-center">
                                <Input placeholder="Buscar informação..." value={localGlobalFilter} onChange={(e) => setLocalGlobalFilter(e.target.value)} className="h-9 w-[200px] md:w-[250px]" onKeyDown={(e) => e.key === 'Enter' && applyFilters()} />
                            </motion.div>
                            {/* Filtro Filial */}
                            <motion.div custom={{ index: 1, total: totalVisibleFilters }} variants={filterVariants} className="flex items-center">
                                <MultiSelectFilter options={filialOptions} selected={localFilialFilter} onChange={setLocalFilialFilter} placeholder="Filiais" className="w-[150px] md:w-[180px]" onKeyDown={(e) => e.key === 'Enter' && applyFilters()} />
                            </motion.div>
                            {/* Filtro Tipo NF */}
                            <motion.div custom={{ index: 2, total: totalVisibleFilters }} variants={filterVariants} className="flex items-center">
                                <MultiSelectFilter options={TIPOS_NF_OPTIONS} selected={localTipoNFFilter} onChange={setLocalTipoNFFilter} placeholder="Tipos de NF" className="w-[180px] md:w-[200px]" onKeyDown={(e) => e.key === 'Enter' && applyFilters()} />
                            </motion.div>
                            {/* Botão Aplicar Filtros */}
                            <motion.div custom={{ index: 3, total: totalVisibleFilters }} variants={filterVariants} className="flex items-center">
                                <Button size={"sm"} onClick={applyFilters} className="h-9">Aplicar</Button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Botões de Ação Direita */}
            <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                {/* REMOVIDO o indicador de loading/spinner baseado em isFiltering */}

                {/* Botão Limpar Filtros (aparece se filtrado) */}
                {isFiltered && (
                    <Button variant="ghost" onClick={clearFilters} className="h-9 px-2 lg:px-3" aria-label="Limpar todos os filtros">
                        Limpar <X className="ml-1.5 h-4 w-4"/>
                    </Button>
                )}
                {/* Botão Exportar */}
                <Button variant="outline" size="sm" onClick={handleExport} className="h-9 hidden sm:flex">
                    <FileSpreadsheet className="mr-1.5 h-4 w-4" /> Exportar
                </Button>
                {/* Botão Refetch */}
                <Button variant="outline" size="icon" onClick={handleRefetch} className="h-9 w-9" aria-label="Atualizar dados" disabled={isRefetching}> {/* Desabilita enquanto refetching */}
                    <RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`} />
                </Button>
            </div>
        </div>
    );
}