"use client";

import React, {useEffect, useState} from "react";

import {Textarea} from "ui";
import {useAtom, useAtomValue} from "jotai";
import {condicoesPagamentoAtom} from "atoms";
import {obsAtom} from "#/incluir/atoms";
import {CondicaoPagamentoModal, DadosNf} from "#/incluir/components/comboboxes";
import XMLDetails from "#/incluir/components/xml/XMLDetails";


const XmlCabecalho = () => {
    // Estado para observações sincronizado com o átomo
    const [observacoes, setObservacoes] = useAtom(obsAtom);


    // Estado para a condição selecionada (usado para abrir o modal)
    const [selectedCondicao, setSelectedCondicao] = useState<string | null>(null);

    // Obtém as condições de pagamento a partir do átomo e formata para o DadosNf
    const condicoesPagamento = useAtomValue(condicoesPagamentoAtom);
    const [condicaoOptions, setCondicaoOptions] = useState<
        { value: string; label: string }[]
    >([]);

    useEffect(() => {
        if (condicoesPagamento && condicoesPagamento.length > 0) {
            const formatted = condicoesPagamento.map((cond: any) => ({
                value: cond.E4_DESCRI.trim(),
                label: cond.E4_DESCRI.trim(),
            }));
            setCondicaoOptions(formatted);
        }
    }, [condicoesPagamento]);

    // Função para tratar a seleção de condição
    const handleSelectCondicao = (condicao: string) => {
        console.log("🔍 Nova condição selecionada:", condicao);
        setSelectedCondicao(condicao);
    };

    return (
        <div className="w-full h-full flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row flex-grow w-full gap-4 sm:gap-7 py-2">
                {/* 🗂️ Comboboxes (Dados da NF) */}
                <div className="flex-1">
                    <DadosNf
                        condicaoOptions={condicaoOptions}
                        onSelectCondicao={handleSelectCondicao}
                        tipo="xml"
                    />
                </div>

                {/* 📝 Detalhes */}
                <div className="flex-1">
                    <XMLDetails/>
                </div>

                {/* 🖊️ Textarea para observações */}
                <div className="flex-1">
                    <Textarea
                        placeholder="Adicione suas Observações..."
                        className="w-full h-32 sm:h-full p-4 resize-none border rounded-md bg-muted/30"
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
};

export default XmlCabecalho;
