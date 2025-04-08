"use client";

import React, {useEffect, useState} from "react";
import {toast} from "sonner";
import {useAtomValue, useSetAtom} from "jotai";
import {accessFiliaisAtom, centrosCustoAtom} from "atoms";
import {GitFork} from "lucide-react";
import {AccessFilial} from "types";
import {rateiosActionsAtom, rateiosAtom, totalGeralAtom} from "#/incluir/atoms";
import {RateioTable} from "#/incluir/components/table";
import {
    Button,
    Combobox,
    DropdownMenuItem,
    Input,
    Label,
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    VerticalSlider,
} from "ui";

interface Option {
    value: string;
    label: string;
}

export function Rateio() {
    const [filiaisOptions, setFiliaisOptions] = useState<Option[]>([]);
    const [centroCustoOptions, setCentroCustoOptions] = useState<Option[]>([]);
    const [selectedFilial, setSelectedFilial] = useState<string | null>(null);
    const [selectedCentroCusto, setSelectedCentroCusto] = useState<string | null>(null);
    const [valor, setValor] = useState<number>(0);
    const [porcentagem, setPorcentagem] = useState<number>(50); // valor inicial
    const filiais = useAtomValue(accessFiliaisAtom);
    const centrosCusto = useAtomValue(centrosCustoAtom);
    const totalGeral = useAtomValue(totalGeralAtom);
    const rateioData = useAtomValue(rateiosAtom);
    const setRateios = useSetAtom(rateiosActionsAtom);

    useEffect(() => {
        if (filiais) {
            setFiliaisOptions(
                filiais.map((filial: AccessFilial) => ({
                    value: filial.M0_CODFIL.trim(),
                    label: filial.M0_FILIAL.trim(),
                }))
            );
        }
    }, [filiais]);

    useEffect(() => {
        if (centrosCusto) {
            setCentroCustoOptions(
                centrosCusto.map((cc) => ({
                    value: cc.CTT_CUSTO.trim(),
                    label: `${cc.CTT_CUSTO.trim()} - ${cc.CTT_DESC01.trim()}`,
                }))
            );
        }
    }, [centrosCusto]);

    const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numericValue = Number(e.target.value.replace(/[^\d]/g, "")) / 100;
        setValor(numericValue);
        const newPercent = Number(((numericValue / totalGeral) * 100).toFixed(2));
        setPorcentagem(newPercent);
    };

    const handlePorcentagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const numericValue = Math.min(Number(e.target.value.replace(/[^\d]/g, "")) / 100, 100);
        setPorcentagem(numericValue);
        const newValor = Number(((numericValue / 100) * totalGeral).toFixed(2));
        setValor(newValor);
    };

    // Atualiza o slider quando a porcentagem mudar
    const handleSliderChange = (values: number[]) => {
        const newPercent = values[0];
        setPorcentagem(newPercent);
        const newValor = Number(((newPercent / 100) * totalGeral).toFixed(2));
        setValor(newValor);
    };

    const handleAddRateio = () => {
        const totalRateio = rateioData.reduce((acc, row) => acc + row.valor, 0);

        if (!selectedFilial) {
            toast.error("Por favor, selecione uma filial.");
            return;
        }
        if (!selectedCentroCusto) {
            toast.error("Por favor, selecione um centro de custo.");
            return;
        }
        if (valor <= 0) {
            toast.error("Por favor, insira um valor válido.");
            return;
        }
        if (totalRateio + valor > totalGeral) {
            toast.error("O valor total do rateio não pode exceder o valor total da NF.");
            return;
        }

        setRateios({
            type: "add",
            payload: {
                seq: `${rateioData.length + 1}`.padStart(3, "0"),
                id: `${Date.now()}`,
                FIL: selectedFilial,
                filial: selectedFilial,
                cc: selectedCentroCusto,
                percent: porcentagem,
                valor,
                REC: 0,
            },
        });

        toast.success("Rateio adicionado com sucesso!");

        setSelectedFilial(null);
        setSelectedCentroCusto(null);
        setValor(0);
        setPorcentagem(0);
    };

    return (
        <Sheet>
            <SheetTrigger>
                <DropdownMenuItem
                    className={"hover:font-semibold group hover:border hover:shadow border-muted-foreground justify-between h-full flex"}>

                    <GitFork className="w-5 h-5 group-hover:text-muted-foreground"/>
                    <span className={"group-hover:text-muted-foreground"}>
                    Rateio
                        </span>
                </DropdownMenuItem>
            </SheetTrigger>
            <SheetContent side="top" className="px-12">
                <div className="flex gap-4">
                    {/* Lado esquerdo: formulário */}
                    <div className="w-1/2">
                        <div className="flex gap-4">
                            {/* Bloco 1: Filial e Centro de Custo */}
                            <div className="flex flex-col w-1/3 gap-3">
                                <Label htmlFor="filial">Adicione a Filial</Label>
                                <Combobox
                                    items={filiaisOptions}
                                    placeholder="Selecione a filial"
                                    onSelect={setSelectedFilial}
                                    selectedValue={selectedFilial}
                                />
                                <Label htmlFor="centro-custo">Adicione o Centro de Custo</Label>
                                <Combobox
                                    items={centroCustoOptions}
                                    placeholder="Selecione o centro de custo"
                                    onSelect={setSelectedCentroCusto}
                                    selectedValue={selectedCentroCusto}
                                />
                            </div>
                            {/* Bloco 2: Valor e Porcentagem */}
                            <div className="flex flex-col w-1/3 gap-3">
                                <Label>Valor (R$)</Label>
                                <Input
                                    id="valor"
                                    placeholder="R$0,00"
                                    onChange={handleValorChange}
                                    value={valor.toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                />
                                <Label>Porcentagem (%)</Label>
                                <Input
                                    id="porcentagem"
                                    placeholder="0,00%"
                                    onChange={handlePorcentagemChange}
                                    value={porcentagem.toFixed(2) + "%"}
                                />
                            </div>
                            {/* Bloco 3: Slider vertical */}
                            <div className="flex items-center justify-center w-fit">
                                <VerticalSlider
                                    value={[porcentagem]}
                                    onValueChange={handleSliderChange}
                                    max={100}
                                    step={1}
                                    className="h-40"  // Ajuste a altura conforme necessário
                                />
                            </div>
                        </div>
                        {/* Botão "Adicionar" abaixo do formulário */}
                        <div className="flex justify-center items-center pt-5">
                            <Button className="w-1/3" variant="secondary" onClick={handleAddRateio}>
                                Adicionar
                            </Button>
                        </div>
                    </div>

                    {/* Lado direito: Tabela */}
                    <div className="w-1/2">
                        <SheetHeader>
                            <SheetTitle className="text-end">Tabela de Distribuição de Rateios</SheetTitle>
                        </SheetHeader>
                        <RateioTable
                            rateioData={rateioData}
                            totalGeral={totalGeral}
                            onUpdateRateio={(id, updatedData) =>
                                setRateios({type: "edit", payload: {id, updatedData}})
                            }
                            onRemoveRateio={(id) =>
                                setRateios({type: "remove", payload: {id}})
                            }
                        />
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit">Confirmar Rateio</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}