"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAtomValue, useSetAtom } from "jotai";
import { accessFiliaisAtom, centrosCustoAtom } from "atoms";
import type { AccessFilial } from "types";
import {
  rateiosActionsAtom,
  rateiosAtom,
  totalGeralAtom,
} from "#/incluir/atoms";
import {
  Button,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  Combobox,
  Input,
  Label,
  Slider,
} from "ui";
import { VercelTab } from "components/aceternity";
import { RateioCards, RateioChartView, RateioTable } from ".";

interface Option {
  value: string;
  label: string;
}

export interface MenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Rateio({ open, onOpenChange }: MenuProps) {
  const [filiaisOptions, setFiliaisOptions] = useState<Option[]>([]);
  const [centroCustoOptions, setCentroCustoOptions] = useState<Option[]>([]);
  const [selectedFilial, setSelectedFilial] = useState<string | null>(null);
  const [selectedCentroCusto, setSelectedCentroCusto] = useState<string | null>(
    null
  );
  const [valor, setValor] = useState<number>(0);
  const [porcentagem, setPorcentagem] = useState<number>(0);

  const filiais = useAtomValue(accessFiliaisAtom);
  const centrosCusto = useAtomValue(centrosCustoAtom);
  const totalGeral = useAtomValue(totalGeralAtom);
  const rateioData = useAtomValue(rateiosAtom);
  const setRateios = useSetAtom(rateiosActionsAtom);

  const totalRateado = rateioData.reduce((acc, row) => acc + row.valor, 0);
  const totalDisponivel = Math.max(totalGeral - totalRateado, 0);
  const percentualUsado = (totalRateado / totalGeral) * 100;
  const maxPercentualDisponivel = Math.max(100 - percentualUsado, 0);

  useEffect(() => {
    if (filiais) {
      setFiliaisOptions(
        filiais.map((filial: AccessFilial) => ({ 
          value: filial.M0_CODFIL.trim(),
          label: `${filial.M0_CODFIL.trim()} - ${filial.M0_FILIAL.trim()}`,
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
    const newPercent = (numericValue / totalGeral) * 100;
    setPorcentagem(Math.min(Number(newPercent.toFixed(2)), maxPercentualDisponivel));
  };

  const handlePorcentagemChange = (newValue: number[]) => {
    const percent = Number(newValue[0].toFixed(2));
    setPorcentagem(percent);
    const newValor = Number(((percent / 100) * totalGeral).toFixed(2));
    setValor(newValor);
  };

  const handleAddRateio = () => {
    if (!selectedFilial) return toast.error("Selecione uma filial.");
    if (!selectedCentroCusto)
      return toast.error("Selecione um centro de custo.");
    if (valor <= 0) return toast.error("Insira um valor válido.");
    if (valor - totalDisponivel > 0.01) {
      return toast.error("Excede o valor restante.");
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

    toast.success("Rateio adicionado!");
    setSelectedFilial(null);
    setSelectedCentroCusto(null);
    setValor(0);
    setPorcentagem(0);
  };

  const handleRemove = (id: string) => {
    setRateios({ type: "remove", payload: { id } });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="min-w-[600px] h-full flex flex-col justify-between gap-4"
      >
        <SheetHeader>
          <SheetTitle className="text-2xl font-semibold">
            Distribuição de Rateio
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col flex-1 overflow-hidden gap-6">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-medium">Filial</Label>
                <Combobox
                  items={filiaisOptions}
                  placeholder="Selecione a filial"
                  onSelect={setSelectedFilial}
                  selectedValue={selectedFilial} 
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-medium">Centro de Custo</Label>
                <Combobox
                  items={centroCustoOptions}
                  placeholder="Centro de custo"
                  onSelect={setSelectedCentroCusto}
                  selectedValue={selectedCentroCusto}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label className="font-medium">Valor</Label>
                <Input
                  placeholder="R$0,00"
                  onChange={handleValorChange}
                  value={valor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="font-medium">Porcentagem</Label>
                <Slider
                  value={[porcentagem]}
                  onValueChange={handlePorcentagemChange}
                  max={maxPercentualDisponivel}
                  step={1}
                  className="w-full"
                />
                <span className="text-sm text-muted-foreground">
                  {porcentagem.toFixed(2)}% — restante:{" "}
                  {maxPercentualDisponivel.toFixed(2)}%
                </span>
              </div>
            </div>

            <Button
              variant="default"
              onClick={handleAddRateio}
              className="w-full sm:w-1/2 mx-auto"
            >
              Adicionar Rateio
            </Button>
          </div>

          <VercelTab
            tabs={[
              { label: "Padrão", value: "padrao" },
              { label: "Tabela", value: "tabela" },
              { label: "Visualização", value: "visualizacao" },
            ]}
            defaultValue="padrao"
            content={{
              padrao: <RateioCards data={rateioData} onRemove={handleRemove} />,
              tabela: (
                <RateioTable
                  rateioData={rateioData}
                  totalGeral={totalGeral}
                  onUpdateRateio={(id, updated) =>
                    setRateios({
                      type: "edit",
                      payload: { id, updatedData: updated },
                    })
                  }
                  onRemoveRateio={(id) =>
                    setRateios({ type: "remove", payload: { id } })
                  }
                />
              ),
              visualizacao: <RateioChartView />,
            }}
          />
        </div>

        <SheetFooter className="flex justify-between gap-2 pt-4">
          <Button
            variant="ghost"
            onClick={() => {
              setRateios({ type: "clear" });
              onOpenChange(false);
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              if (rateioData.length === 0) {
                toast.error("Adicione pelo menos um item de rateio.");
                return;
              }

              const somaPorcentagem = rateioData.reduce(
                (acc, item) => acc + item.percent,
                0
              );

              if (Math.abs(somaPorcentagem - 100) > 0.01) {
                toast.error(
                  `A soma da porcentagem precisa ser exatamente 100%. Atualmente: ${somaPorcentagem.toFixed(
                    2
                  )}%`
                );
                return;
              }

              toast.success("Rateios salvos com sucesso!");
              onOpenChange(false);
            }}
          >
            Salvar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
