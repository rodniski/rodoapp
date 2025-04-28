// _lib/components/stepper/header/RateioForm.tsx (Final com Input e Format on Blur)
"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Label,
  Combobox,
  Input, // <<< Usando Input da UI Lib
  Slider,
  Button,
} from "ui";
import { formatCurrency } from "utils"; // Certifique-se que o path está correto

// Interface para opções do Combobox
interface ComboboxOption {
  value: string;
  label: string;
}

// Props que este formulário receberá do RateioCard
interface RateioFormProps {
  filiaisOptions: ComboboxOption[];
  centroCustoOptions: ComboboxOption[];
  selectedFilial: string | null;
  selectedCentroCusto: string | null;
  valor: number; // O valor numérico real (controlado pelo pai)
  porcentagem: number;
  setSelectedFilial: (value: string | null) => void;
  setSelectedCentroCusto: (value: string | null) => void;
  handleValorChange: (value: number | undefined) => void; // Notifica o pai sobre a MUDANÇA NUMÉRICA
  handlePorcentagemChange: (values: number[]) => void;
  handleAddRateio: () => void;
  maxValorDisponivel: number;
  maxPercentualDisponivel: number;
  totalGeral: number;
}

// Função auxiliar para parse robusto (pode ir para utils)
const parseInputToNumber = (input: string): number => {
    if (!input) return 0;
    const cleaned = input.replace(/[^0-9,.]/g, '');
    if (cleaned.includes(',')) {
        const parts = cleaned.split(',');
        const integerPart = parts[0].replace(/\./g, '');
        const decimalPart = parts[1] ?? '';
        return parseFloat(`${integerPart}.${decimalPart}`) || 0;
    }
    if (cleaned.includes('.')) {
        const lastDotIndex = cleaned.lastIndexOf('.');
        const integerPart = cleaned.substring(0, lastDotIndex).replace(/\./g, '');
        const decimalPart = cleaned.substring(lastDotIndex + 1);
         return parseFloat(`${integerPart}.${decimalPart}`) || 0;
    }
    return parseFloat(cleaned) || 0;
};


export function RateioForm({
  filiaisOptions,
  centroCustoOptions,
  selectedFilial,
  selectedCentroCusto,
  valor,
  porcentagem,
  setSelectedFilial,
  setSelectedCentroCusto,
  handleValorChange,
  handlePorcentagemChange,
  handleAddRateio,
  maxValorDisponivel,
  maxPercentualDisponivel,
  totalGeral,
}: RateioFormProps) {
  // --- Estado Local para o Input de Valor ---
  const [displayValor, setDisplayValor] = useState<string>("");
  const [isValorFocused, setIsValorFocused] = useState<boolean>(false);

  // --- Efeito para Sincronizar Display com Prop 'valor' (quando não focado) ---
  useEffect(() => {
    if (!isValorFocused) {
       setDisplayValor(valor > 0 ? formatCurrency(valor) : "");
    }
  }, [valor, isValorFocused]);

  // --- Handlers para o Input de Valor ---
  const handleValorFocus = () => {
    setIsValorFocused(true);
    // Ao focar, usa vírgula como separador decimal para digitação no padrão BR
    setDisplayValor(valor > 0 ? String(valor.toFixed(2)).replace('.', ',') : "");
  };

  const handleValorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValor(e.target.value);
    // Opcional: Atualizar valor numérico enquanto digita (descomente se necessário)
    /*
     const parsed = parseInputToNumber(e.target.value);
     const capped = Math.min(parsed, maxValorDisponivel + 0.001);
     if (valor !== capped) { handleValorChange(capped); }
    */
  };

  const handleValorBlur = () => {
    setIsValorFocused(false);
    const parsedValue = parseInputToNumber(displayValor);
    const finalValue = Math.min(parsedValue, maxValorDisponivel + 0.001);
    const cappedFinalValue = parseFloat(finalValue.toFixed(2));
    if (valor !== cappedFinalValue) {
       handleValorChange(cappedFinalValue);
    } else {
       // Força re-formatação mesmo se o valor numérico não mudou (ex: usuário digitou R$)
       setDisplayValor(cappedFinalValue > 0 ? formatCurrency(cappedFinalValue) : "");
    }
  };

  return (
    <div className="p-4 border-b bg-card">
      {/* Comboboxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col gap-1.5">
          <Label className="font-medium text-sm">Filial</Label>
          <Combobox
            items={filiaisOptions}
            placeholder="Selecione a filial"
            searchPlaceholder="Buscar filial..." // Adicionado placeholder de busca
            onSelect={setSelectedFilial}
            selectedValue={selectedFilial}
            triggerClassName="h-9 text-xs" // Ajuste de classes
            contentClassName="text-xs"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="font-medium text-sm">Centro de Custo</Label>
          <Combobox
            items={centroCustoOptions}
            placeholder="Centro de custo"
            searchPlaceholder="Buscar CC..." // Adicionado placeholder de busca
            onSelect={setSelectedCentroCusto}
            selectedValue={selectedCentroCusto}
            triggerClassName="h-9 text-xs" // Ajuste de classes
            contentClassName="text-xs"
          />
        </div>
      </div>

      {/* Inputs Valor e Percentual */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Input Valor */}
        <div className="flex flex-col gap-1.5">
          <Label className="font-medium text-sm flex justify-between">
            <span>Valor</span>
            <span className="text-muted-foreground text-xs font-normal">
              Restante:{" "}
              {maxValorDisponivel.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
            </span>
          </Label>
          <Input
             type="text"
             inputMode="decimal"
             value={displayValor}
             onChange={handleValorInputChange}
             onFocus={handleValorFocus}
             onBlur={handleValorBlur}
             className="text-right text-xs h-9 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
             placeholder={isValorFocused ? "0,00" : "R$ 0,00"}
             disabled={totalGeral <= 0 || maxValorDisponivel < 0.01}
          />
        </div>
        {/* Slider Porcentagem */}
        <div className="flex flex-col gap-1.5">
          <Label className="font-medium text-sm">Porcentagem</Label>
          <Slider
            value={[porcentagem]}
            onValueChange={handlePorcentagemChange}
            max={100}
            step={0.01}
            className="w-full pt-2"
            disabled={totalGeral <= 0 || maxPercentualDisponivel < 0.01}
          />
          <span className="text-xs text-muted-foreground text-right pt-1">
            {porcentagem.toFixed(2)}% (Máx: {maxPercentualDisponivel.toFixed(2)}%)
          </span>
        </div>
      </div>

      {/* Botão Adicionar */}
      <div className="flex justify-center sm:justify-end">
        <Button
          variant="default"
          onClick={handleAddRateio}
          disabled={ !selectedFilial || !selectedCentroCusto || valor < 0.01 || maxValorDisponivel < 0.01 }
          className="w-full sm:w-auto"
        >
          Adicionar Rateio
        </Button>
      </div>
    </div>
  );
}