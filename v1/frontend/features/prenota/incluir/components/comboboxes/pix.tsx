"use client";

import React, { useEffect, useRef, useState } from "react";
import { Input, Label, Textarea, Switch } from "ui";
import { useAtom, useAtomValue } from "jotai";
import { fornecedorAtom, cgcPixAtom, chavePixAtom } from "#/incluir/atoms";

export interface DadosPix {
    cnpjDestinatario: string;
    chavePix: string;
    justificativa?: string;
}

interface PixFormProps {
    dados: DadosPix;
    onChange: (dados: DadosPix) => void;
}

export function PixForm({ dados, onChange }: PixFormProps) {
    const supplier = useAtomValue(fornecedorAtom);
    // Cria um ref para armazenar o valor original do CNPJ assim que o componente for montado
    const originalCnpjRef = useRef<string>("");
    const [pixActive, setPixActive] = useState(false);
    const [localDados, setLocalDados] = useState<DadosPix>(dados);

    // No primeiro render, define o valor original se ainda não estiver definido
    useEffect(() => {
        if (!originalCnpjRef.current && localDados.cnpjDestinatario) {
            originalCnpjRef.current = localDados.cnpjDestinatario.trim();
        }
    }, [localDados.cnpjDestinatario]);

    // Atualiza o estado local quando a prop 'dados' muda
    useEffect(() => {
        setLocalDados(dados);
    }, [dados]);

    // Atualiza os átomos relacionados
    const [, setCgcPix] = useAtom(cgcPixAtom);
    const [, setChavePix] = useAtom(chavePixAtom);
    useEffect(() => {
        setCgcPix(localDados.cnpjDestinatario);
        setChavePix(localDados.chavePix);
    }, [localDados.cnpjDestinatario, localDados.chavePix, setCgcPix, setChavePix]);

    // Quando o switch é ativado, se o campo estiver vazio, preenche com o supplier
    useEffect(() => {
        if (pixActive && !localDados.cnpjDestinatario && supplier) {
            const updated = { ...localDados, cnpjDestinatario: supplier };
            setLocalDados(updated);
            onChange(updated);
        }
    }, [pixActive, supplier, localDados, onChange]);

    return (
        <div className="border p-4">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold">Dados do PIX</h4>
                <Switch
                    checked={pixActive}
                    onCheckedChange={(checked) => setPixActive(checked)}
                />
            </div>
            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label htmlFor="cnpjDestinatario">CNPJ do Destinatário</Label>
                    <Input
                        id="cnpjDestinatario"
                        value={localDados.cnpjDestinatario}
                        onChange={(e) => {
                            const updated = { ...localDados, cnpjDestinatario: e.target.value };
                            setLocalDados(updated);
                            onChange(updated);
                        }}
                        placeholder="CNPJ do destinatário"
                        disabled={!pixActive}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="chavePix">Chave PIX</Label>
                    <Input
                        id="chavePix"
                        value={localDados.chavePix}
                        onChange={(e) => {
                            const updated = { ...localDados, chavePix: e.target.value };
                            setLocalDados(updated);
                            onChange(updated);
                        }}
                        placeholder="Informe a chave PIX"
                        disabled={!pixActive}
                    />
                </div>
                {pixActive &&
                    localDados.cnpjDestinatario.trim() !== originalCnpjRef.current && (
                        <div className="grid gap-2">
                            <Label htmlFor="justificativa" className="text-yellow-600">
                                Justificativa da Alteração do CNPJ
                            </Label>
                            <Textarea
                                id="justificativa"
                                value={localDados.justificativa || ""}
                                onChange={(e) => {
                                    const updated = { ...localDados, justificativa: e.target.value };
                                    setLocalDados(updated);
                                    onChange(updated);
                                }}
                                placeholder="Explique o motivo da alteração do CNPJ"
                                className="min-h-[100px]"
                            />
                        </div>
                    )}
            </div>
        </div>
    );
}
