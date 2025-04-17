"use client";

import * as React from "react";
import {useAtomValue} from "jotai";
import {AnimatePresence, motion} from "framer-motion";
import type {Table} from "@tanstack/react-table";
import {MultiSelectFilter} from "./multi-select-filter";
import {FileSpreadsheet, Filter, FilterX, RefreshCw, X} from "lucide-react";
import {Button, Input} from "ui";
import {MultiStepLoader} from "components/aceternity";
import {AnimatedButton} from "#/incluir/components/buttons";

// Importa o átomo de filiais
import {accessFiliaisAtom} from "atoms";
// Importa diretamente as opções fixas de tipos de NF
import {STATUS_NF_OPTIONS, TIPOS_NF_OPTIONS} from "#/dashboard/interfaces";

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    globalFilter: string;
    setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
    onExport?: () => void;
    onRefetch?: () => void;
    hasSelection?: boolean;
    isRefetching?: boolean;
}

const loadingSteps = [
    {text: "Aplicando filtros..."},
    {text: "Processando dados..."},
];

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
    const [isFiltering, setIsFiltering] = React.useState(false); // Estado para indicar filtragem
    const [localGlobalFilter, setLocalGlobalFilter] = React.useState(globalFilter);
    const [localFilialFilter, setLocalFilialFilter] = React.useState<string[]>(
        (table.getColumn("F1Filial")?.getFilterValue() as string[]) || []
    );
    const [localTipoNFFilter, setLocalTipoNFFilter] = React.useState<string[]>(
        (table.getColumn("F1XTipo")?.getFilterValue() as string[]) || []
    );
    const [localStatusNFFilter, setLocalStatusNFFilter] = React.useState<string[]>(
        (table.getColumn("F1Status")?.getFilterValue() as string[]) || []
    );

    // Converte AccessFilial[] para OptionType[]
    const filialOptions = filiais.map((filial) => ({
        label: filial.M0_FILIAL,
        value: filial.M0_CODFIL,
    }));

    // Função para aplicar os filtros
    const applyFilters = React.useCallback(() => {
        setIsFiltering(true);
        table.getColumn("F1Filial")?.setFilterValue(localFilialFilter.length ? localFilialFilter : undefined);
        table.getColumn("F1XTipo")?.setFilterValue(localTipoNFFilter.length ? localTipoNFFilter : undefined);
        table.getColumn("F1Status")?.setFilterValue(localStatusNFFilter.length ? localStatusNFFilter : undefined);
        setGlobalFilter(localGlobalFilter);

        // Simulamos o fim do processamento após um pequeno delay
        const timeout = setTimeout(() => {
            setIsFiltering(false);
        }, 500);
        return () => clearTimeout(timeout);
    }, [
        table,
        localFilialFilter,
        localTipoNFFilter,
        localStatusNFFilter,
        localGlobalFilter,
        setGlobalFilter,
        setIsFiltering,
    ]);

    // Função para exportar dados selecionados ou todos os dados
    const handleExport = React.useCallback(() => {
        if (onExport) {
            onExport();
        } else {
            const rows = hasSelection ? table.getSelectedRowModel().rows : table.getFilteredRowModel().rows;
            const headers = table
                .getAllColumns()
                .filter((column) => column.id !== "actions")
                .map((column) => column.id);

            const csvData = [
                headers.join(","),
                ...rows.map((row) =>
                    headers
                        .map((header) => {
                            const value = row.getValue(header);
                            return typeof value === "string" ? `"${value.replace(/"/g, '""')}"` : value;
                        })
                        .join(","),
                ),
            ].join("\n");

            const blob = new Blob([csvData], {type: "text/csv;charset=utf-8;"});
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "pre-notas.csv");
            link.style.visibility = "hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }, [table, onExport, hasSelection]);

    // Função para lidar com o refetch
    const handleRefetch = React.useCallback(() => {
        if (onRefetch) {
            onRefetch();
        }
    }, [onRefetch]);

    const filterVariants = {
        hidden: {opacity: 0, x: -20},
        visible: ({index}: { index: number; total: number }) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: index * 0.15,
                duration: 0.45,
            },
        }),
        exit: ({index, total}: { index: number; total: number }) => ({
            opacity: 0,
            x: -20,
            transition: {
                delay: (total - 1 - index) * 0.15,
                duration: 0.45,
            },
        }),
    };

    return (
        <div className="flex items-center justify-between flex-wrap h-14 gap-4">
            <div className="flex gap-2 flex-wrap h-14">
                <Button variant="secondary" onClick={() => setShowFilters(!showFilters)}>
                    <AnimatePresence mode="wait">
                        {showFilters ? (
                            <motion.span
                                key="filterX"
                                initial={{opacity: 0, rotate: -45}}
                                animate={{opacity: 1, rotate: 0}}
                                exit={{opacity: 0, rotate: -45}}
                                transition={{duration: 0.1}}
                            >
                                <FilterX className="h-4 w-4"/>
                            </motion.span>
                        ) : (
                            <motion.span
                                key="filter"
                                initial={{opacity: 0, rotate: 45}}
                                animate={{opacity: 1, rotate: 0}}
                                exit={{opacity: 0, rotate: 45}}
                                transition={{duration: 0.1}}
                            >
                                <Filter className="h-4 w-4"/>
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Button>

                <AnimatePresence>
                    {showFilters && (
                        <div className="flex items-center gap-2 h-14">
                            <motion.div
                                custom={{index: 0, total: 5}}
                                variants={filterVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="h-14"
                            >
                                <Input
                                    placeholder="Buscar informação..."
                                    value={localGlobalFilter}
                                    onChange={(event) => setLocalGlobalFilter(event.target.value)}
                                    className="w-[250px] md:w-[300px]"
                                    aria-label="Buscar em todas as colunas"
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            applyFilters();
                                        }
                                    }}
                                />
                            </motion.div>
                            <motion.div
                                custom={{index: 1, total: 5}}
                                variants={filterVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="h-14"
                            >
                                <MultiSelectFilter
                                    options={filialOptions}
                                    selected={localFilialFilter}
                                    onChange={setLocalFilialFilter}
                                    placeholder="Filiais"
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            applyFilters();
                                        }
                                    }}
                                />
                            </motion.div>
                            <motion.div
                                custom={{index: 2, total: 5}}
                                variants={filterVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="h-14"
                            >
                                <MultiSelectFilter
                                    options={TIPOS_NF_OPTIONS}
                                    selected={localTipoNFFilter}
                                    onChange={setLocalTipoNFFilter}
                                    placeholder="Tipos de NF"
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            applyFilters();
                                        }
                                    }}
                                />
                            </motion.div>
                            <motion.div
                                custom={{index: 3, total: 5}}
                                variants={filterVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="h-14"
                            >
                                <MultiSelectFilter
                                    options={STATUS_NF_OPTIONS}
                                    selected={localStatusNFFilter}
                                    onChange={setLocalStatusNFFilter}
                                    placeholder="Status da NF"
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            applyFilters();
                                        }
                                    }}
                                />
                            </motion.div>
                            <motion.div
                                custom={{index: 4, total: 5}}
                                variants={filterVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="h-14 flex items-center"
                            >
                                <Button size={"sm"} onClick={applyFilters} onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        applyFilters();
                                    }
                                }}>
                                    Aplicar Filtro
                                </Button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <div className="flex items-center gap-2 ml-auto">
                {/* Indicador de loading para filtragem ou refetching */}
                <AnimatePresence>
                    {(isFiltering || isRefetching) && (
                        <motion.div
                            initial={{opacity: 0, scale: 0.8}}
                            animate={{opacity: 1, scale: 1}}
                            exit={{opacity: 0, scale: 0.8}}
                            transition={{duration: 0.2}}
                        >
                            <MultiStepLoader loadingStates={loadingSteps} loading duration={2400}/>
                        </motion.div>
                    )}
                </AnimatePresence>

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setLocalGlobalFilter("");
                            setLocalFilialFilter([]);
                            setLocalTipoNFFilter([]);
                            setLocalStatusNFFilter([]);
                            table.resetColumnFilters();
                            setGlobalFilter("");
                        }}
                        className="h-8 px-2 lg:px-3"
                        aria-label="Limpar todos os filtros"
                    >
                        Limpar filtros
                        <X className="ml-2 h-4 w-4"/>
                    </Button>
                )}
                <AnimatedButton text="Exportar" icon={<FileSpreadsheet/>} onClick={handleExport}/>
                <AnimatedButton
                    text="Update"
                    icon={<RefreshCw className={`h-4 w-4 ${isRefetching ? "animate-spin" : ""}`}/>}
                    onClick={handleRefetch}
                />
            </div>
        </div>
    );
}