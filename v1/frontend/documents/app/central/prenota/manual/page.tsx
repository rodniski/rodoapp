// src/app/central/prenota/lancamento-manual/page.tsx
"use client";

import React, { useEffect } from "react";
import { ManualCabecalho, TabelaManual } from "#/incluir/components/manual";
import { useBreadcrumbs } from "lib";

const Page = () => {
    const { setBreadcrumbs } = useBreadcrumbs();

    useEffect(() => {
        setBreadcrumbs([
            { label: "RodoApp", href: "/central" },
            { label: "Pré Notas", href: "/central/prenota" },
            { label: "Lançamento Manual" },
        ]);
    }, [setBreadcrumbs]);

    return (
        <main className="h-[90vh] flex-1 w-full flex flex-col gap-3 pt-2 bg-muted/50 p-2 rounded-lg shadow-md">
            <header>
                <ManualCabecalho />
            </header>
            <section>
                <div className="text-center text-muted-foreground flex flex-col w-full h-full lg:overflow-hidden">
                    <TabelaManual />
                </div>
            </section>
        </main>
    );
};

export default Page;
