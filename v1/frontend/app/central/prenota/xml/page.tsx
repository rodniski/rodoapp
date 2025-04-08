"use client";

import React, {useEffect} from "react";
import {useAtomValue} from "jotai";
import {useBreadcrumbs} from "lib";
import {xmlColumns} from "./columns";
import {InclusaoTable} from "#/incluir/components/table/InclusaoTable";
import XmlCabecalho from "#/incluir/components/xml/Cabecalho";
import {itensAtom} from "#/incluir/atoms";

const Page = () => {
    const {setBreadcrumbs} = useBreadcrumbs();
    const tableData = useAtomValue(itensAtom);

    useEffect(() => {
        setBreadcrumbs([
            {label: "RodoApp", href: "/central"},
            {label: "Pré Notas", href: "/central/prenota"},
            {label: "Importação de XML"},
        ]);
    }, [setBreadcrumbs]);

    return (
        <main className="h-full flex-1 w-full flex flex-col gap-2 pt-1 pb-3 p-2">
            {/* Header */}
            <header className="shrink-0">
                <XmlCabecalho/>
            </header>

            {/* Section para a tabela */}
            <section className="flex-1"> {/* Adiciona flex-1 para ocupar o espaço restante */}
                <div className="text-center text-muted-foreground flex flex-col w-full h-full lg:overflow-hidden">
                    <InclusaoTable data={tableData} columns={xmlColumns}/>
                </div>
            </section>
        </main>
    );
};

export default Page;