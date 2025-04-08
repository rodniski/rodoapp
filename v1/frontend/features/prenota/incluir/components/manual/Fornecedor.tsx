"use client";

import React, {useEffect, useRef, useState} from "react";
import {useSetAtom} from "jotai";
import {fornecedorAtom, lojaAtom, fornecedorSupAtom} from "#/incluir/atoms";
import {Button, Input, Popover, PopoverContent, PopoverTrigger,} from "ui";
import {ChevronsUpDown, Loader2} from "lucide-react";

interface Fornecedor {
    loja: string;
    numero: string;
    fornecedor: string;
    estado: string;
    cidade: string;
    cgc: string;
}

interface FornecedorComboboxProps {
    placeholder?: string;
    limit?: number;
    onSelect?: (value: string | null) => void;
    buttonLabel?: string;
}

function formatCNPJ(cgc: string) {
    if (!cgc) return "";
    const cleaned = cgc.replace(/\D/g, "").padStart(14, "0");
    return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, "$1.$2.$3/$4-$5");
}

export function FornecedorCombobox({
                                       placeholder = "Buscar Fornecedor...",
                                       limit = 50,
                                       onSelect,
                                       buttonLabel = "Selecione um fornecedor",
                                   }: FornecedorComboboxProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
    const [selectedValue, setSelectedValue] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<Fornecedor[]>([]);

    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    const setFornecedorAtom = useSetAtom(fornecedorAtom);
    const setFornecedorSupAtom = useSetAtom(fornecedorSupAtom);
    const setLojaAtom = useSetAtom(lojaAtom);

    useEffect(() => {
        const storedHistory = localStorage.getItem("fornecedorHistory");
        if (storedHistory) {
            try {
                setHistory(JSON.parse(storedHistory));
            } catch (error) {
                console.error("Erro ao analisar histórico:", error);
                localStorage.removeItem("fornecedorHistory");
            }
        }
    }, []);

    useEffect(() => {
        if (history.length > 0) {
            localStorage.setItem("fornecedorHistory", JSON.stringify(history));
        }
    }, [history]);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setFornecedores([]);
            return;
        }
        setLoading(true);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            fetch(`/api/fornecedores?search=${searchTerm}&limit=${limit}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.fornecedores) {
                        setFornecedores(data.fornecedores);
                    } else {
                        setFornecedores([]);
                    }
                })
                .catch((err) => {
                    console.error("Erro ao buscar:", err);
                    setFornecedores([]);
                })
                .finally(() => setLoading(false));
        }, 300);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [searchTerm, limit]);

    const handleSelect = (cgc: string) => {
        let found: Fornecedor | undefined;

        if (cgc === selectedValue) {
            setSelectedValue(null);
            setFornecedorAtom("");
            setLojaAtom("");
            onSelect?.(null);
            setOpen(false);
            return;
        }

        // eslint-disable-next-line prefer-const
        found =
            history.find((f) => f.cgc === cgc) ||
            fornecedores.find((f) => f.cgc === cgc);

        if (found) {
            setSelectedValue(cgc);
            setFornecedorAtom(found.numero);
            setFornecedorSupAtom(found.cgc)
            setLojaAtom(found.loja);
            onSelect?.(cgc);
            const updatedHistory = [found, ...history.filter((f) => f.cgc !== cgc)];
            setHistory(updatedHistory);
        } else {
            setSelectedValue(null);
            setFornecedorAtom("");
            setLojaAtom("");
            onSelect?.(null);
        }
        setOpen(false);
    };

    const selectedForn =
        history.find((f) => f.cgc === selectedValue) ||
        fornecedores.find((f) => f.cgc === selectedValue);
    const buttonText = selectedForn ? selectedForn.fornecedor.trim() : buttonLabel;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={triggerRef}
                    variant="outline"
                    className="w-full justify-between truncate"
                    onClick={() => setOpen(true)}
                >
                    {buttonText}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                className="p-0 flex flex-col gap-2 max-h-96" // p-0 e gap-2
                style={{
                    width: triggerRef.current?.offsetWidth || "auto",
                }}
            >
                {/* Input de busca - agora dentro de um container com padding */}
                <div className="p-2 sticky top-0 bg-background z-10">
                    <Input
                        type="text"
                        placeholder={placeholder}
                        className="w-full outline-none text-sm" // Removido o padding e borda
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />
                </div>

                {/* Container para histórico e resultados - com overflow-auto */}
                <div className="overflow-auto flex-grow">
                    {/* Histórico */}
                    {history.length > 0 && (
                        <div className="border rounded m-2"> {/* Adicionado margem */}
                            <p className="text-xs text-center py-1 w-full font-medium text-muted-foreground bg-muted">
                                Histórico
                            </p>
                            <ul className="space-y-1 p-1">
                                {history.map((forn) => (
                                    <li
                                        key={forn.cgc}
                                        className="cursor-pointer p-1 rounded-sm hover:bg-accent hover:text-accent-foreground text-sm"
                                        onClick={() => handleSelect(forn.cgc)}
                                    >
                                        <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground">
                        {forn.numero} - {forn.loja}
                      </span>
                                            <span className="font-medium">
                        {forn.fornecedor.trim()}
                      </span>
                                            <span className="text-xs text-muted-foreground">
                        {forn.cidade}, {forn.estado} — {formatCNPJ(forn.cgc)}
                      </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Resultados da busca */}
                    {(!loading && fornecedores.length === 0 && searchTerm.trim()) && (
                        <p className="text-sm px-2">Nenhum resultado</p> // Adicionado padding
                    )}

                    {loading && (
                        <div className="flex items-center justify-center gap-2 py-5 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin"/>
                            Carregando...
                        </div>
                    )}

                    {!loading && fornecedores.length > 0 && (
                        <ul className="space-y-1 p-1">
                            {" "}
                            {/* Adicionado padding */}
                            {fornecedores.map((forn) => (
                                <li
                                    key={forn.cgc}
                                    className="cursor-pointer p-1 rounded-sm hover:bg-accent hover:text-accent-foreground text-sm"
                                    onClick={() => handleSelect(forn.cgc)}
                                >
                                    <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground">
                      {forn.numero} - {forn.loja}
                    </span>
                                        <span className="font-medium">{forn.fornecedor.trim()}</span>
                                        <span className="text-xs text-muted-foreground">
                      {forn.cidade}, {forn.estado} — {formatCNPJ(forn.cgc)}
                    </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}