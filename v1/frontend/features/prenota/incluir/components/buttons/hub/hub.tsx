"use client";

import React, {useState} from "react";
import {
    DropdownMenuItem,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "ui";
import {CheckCircle, Circle, Pickaxe} from "lucide-react";
import {useAtomValue} from "jotai";
import {anexosAtom, arquivosAtom, arquivosUploadAtom, hubAtom} from "#/incluir/atoms";
import {HubAnexosTab, HubJsonTab, HubProgressTab} from ".";
import { MenuProps } from "..";


export default function HubDevelopmentSheet({open, onOpenChange}: MenuProps) {
    const [expandedFields, setExpandedFields] = useState<string[]>([]);
    const hubData = useAtomValue(hubAtom) || {};

    // Dados dos anexos
    const anexosHub = useAtomValue(arquivosAtom) || [];
    const anexosUpload = useAtomValue(arquivosUploadAtom) || [];
    const anexosCompleto = useAtomValue(anexosAtom) || [];

    // Cria um array de campos a partir do hubData
    const fields = Object.entries(hubData).map(([key, value]) => ({
        key,
        label: key,
        value,
    }));

    // Calcula o progresso (percentual de campos preenchidos)
    const filledFields = fields.filter((field) => {
        if (Array.isArray(field.value)) return field.value.length > 0;
        if (typeof field.value === "object" && field.value !== null)
            return Object.keys(field.value).length > 0;
        if (typeof field.value === "string") return field.value.trim() !== "";
        if (typeof field.value === "number") return field.value !== 0;
        return !!field.value;
    });
    const progressPercentage = (filledFields.length / fields.length) * 100;

    // Função para alternar a expansão dos campos (caso sejam arrays)
    const toggleExpand = (key: string) => {
        setExpandedFields((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    // Função para exibir o ícone de status de cada campo
    const getStatusIcon = (field: { value: any }) =>
        (Array.isArray(field.value)
            ? field.value.length > 0
            : (typeof field.value === "object" && field.value !== null)
                ? Object.keys(field.value).length > 0
                : typeof field.value === "string"
                    ? field.value.trim() !== ""
                    : typeof field.value === "number"
                        ? field.value !== 0
                        : !!field.value) ? (
            <CheckCircle className="text-green-500 dark:text-green-400 w-5 h-5"/>
        ) : (
            <Circle className="text-muted-foreground-foreground w-5 h-5"/>
        );

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent className="min-w-[600px] flex flex-col gap-4 overflow-auto">
                    <SheetHeader>
                        <SheetTitle>Desenvolvimento do Hub</SheetTitle>
                    </SheetHeader>

                    <Tabs defaultValue="progress" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="progress">Progresso</TabsTrigger>
                            <TabsTrigger value="json">JSON Format</TabsTrigger>
                            <TabsTrigger value="anexos">Anexos</TabsTrigger>
                        </TabsList>

                        <TabsContent value="progress" className="mt-4">
                            <HubProgressTab
                                fields={fields}
                                progressPercentage={progressPercentage}
                                expandedFields={expandedFields}
                                toggleExpand={toggleExpand}
                                getStatusIcon={getStatusIcon}
                            />
                        </TabsContent>

                        <TabsContent value="json" className="mt-4">
                            <HubJsonTab hubData={hubData}/>
                        </TabsContent>

                        <TabsContent value="anexos" className="mt-4">
                            <HubAnexosTab
                                anexosHub={anexosHub}
                                anexosUpload={anexosUpload}
                                anexosCompleto={anexosCompleto}
                            />
                        </TabsContent>
                    </Tabs>
                </SheetContent>
            </Sheet>
        </>
    );
}
