"use client";

import React, {useEffect} from "react";
import {useBreadcrumbs} from "lib";
import {BorColumns} from "@/components";
import {useMovPortaria} from "@/hooks";
import {DataTable} from "ui/data-table";
import {ScrollArea} from "$/components/ui";

const Page = () => {
    const {setBreadcrumbs} = useBreadcrumbs();
    const {data, isLoading} = useMovPortaria({
        type: "borracharia",
    });

    useEffect(() => {
        setBreadcrumbs([
            {label: "RodoApp", href: "/central"},
            {label: "Controle de Saída", href: "/central/lancamento"},
            {label: "Lançamentos"},
        ]);
    }, [setBreadcrumbs]);

    console.log("Page Data:", {data, isLoading});

    return (
        <ScrollArea className="h-[calc(100vh-60px)]">
            <div className="flex flex-col h-full p-6">
                <h1 className="text-4xl font-bold mb-6">
                    Central de Carregamento de Pneus
                </h1>
                <DataTable
                    columns={BorColumns}
                    data={data || []}
                    isLoading={isLoading}
                />
            </div>
        </ScrollArea>
    );
};

export default Page;
