// FilterRow.tsx
"use client";

import { Input, MultiSelect } from "@/_core/components"; // Verifique o caminho
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Button,
  Label,
} from "ui"; // Verifique o caminho
import { CAMPOS_FILTRO } from "@prenota/stores"; // Verifique o caminho
import { TrashIcon } from "@radix-ui/react-icons";
// Importe o seu componente seletor de filial
import FiltroFilialSelect from "./FiltroFilialSelect"; // Verifique o caminho

interface LocalFilter {
  id: string;
  field: string;
  value: any;
}

interface FilterRowProps {
  filter: LocalFilter;
  onChange: (id: string, field: string, value: any) => void;
  onRemove: (id: string) => void;
}

/**
 * Componente que renderiza uma linha de filtro configurável dinamicamente.
 * SEM estilização de card individual. Renderiza diferentes inputs baseado no tipo de campo.
 */
export function FilterRow({ filter, onChange, onRemove }: FilterRowProps) {
  const logPrefix = "[FilterRow]";
  const fieldConfig = CAMPOS_FILTRO.find((f) => f.campo === filter.field);

  // Log removido para produção, descomente para debug se necessário
  // console.log(`${logPrefix} Renderizando:`, { filter, fieldConfig });

  if (!fieldConfig) {
    console.error(
      `${logPrefix} Configuração não encontrada para o campo: ${filter.field}`
    );
    return null; // Não renderiza se a configuração do campo não existe
  }

  // Handler para mudança no campo (Select de Campo)
  const handleFieldChange = (newField: string) => {
    const newFieldConfig = CAMPOS_FILTRO.find((f) => f.campo === newField);
    let resetValue: any;

    // Define valor inicial baseado no novo tipo de campo
    switch (newFieldConfig?.tipo) {
      case "select-multiple":
      case "filial-select": // Filial também usa array
        resetValue = [];
        break;
      case "data-range":
      case "numero-range":
        resetValue = { from: "", to: "" }; // Usa strings vazias
        break;
      default:
        resetValue = ""; // String vazia para texto/select simples
    }
    // Chama onChange com o novo campo e valor resetado
    onChange(filter.id, newField, resetValue);
  };

  // Handler genérico unificado para mudança de valor nos inputs
  const handleValueChange = (newValue: any) => {
    // Se for um campo de range, garante que o valor seja um objeto {from, to} com strings
    if (
      fieldConfig.tipo === "data-range" ||
      fieldConfig.tipo === "numero-range"
    ) {
      const currentVal = filter.value || { from: "", to: "" };
      // O newValue pode ser o objeto completo ou apenas uma parte {from: '...'} ou {to: '...'}
      const mergedValue = {
        from: String(newValue?.from ?? currentVal.from ?? ""), // Garante que 'from' exista como string
        to: String(newValue?.to ?? currentVal.to ?? ""), // Garante que 'to' exista como string
      };
      onChange(filter.id, filter.field, mergedValue); // Envia o objeto completo
    } else {
      // Para outros tipos, envia o valor diretamente
      onChange(filter.id, filter.field, newValue);
    }
  };

  // Handler específico para inputs de range (que disparam onChange com e.target.value)
  const handleRangeInputChange = (part: "from" | "to", inputValue: string) => {
    const currentVal = filter.value || { from: "", to: "" };
    // Cria o objeto parcial e passa para o handler genérico fazer o merge
    handleValueChange({ ...currentVal, [part]: inputValue });
  };

  return (
    // Container da linha: sem card, com padding vertical e borda inferior (exceto último)
    <div className="flex justify-center items-top gap-3">
      {/* Seletor de Campo */}
      <div className="flex-shrink-0 w-full sm:w-48">
        <Label htmlFor={`field-select-${filter.id}`} className="text-xs mb-1">
          Campo
        </Label>
        <Select value={filter.field} onValueChange={handleFieldChange}>
          <SelectTrigger className="w-full" id={`field-select-${filter.id}`}>
            <SelectValue placeholder="Selecione um campo" />
          </SelectTrigger>
          <SelectContent>
            {/* Mapeia todos os campos configurados */}
            {CAMPOS_FILTRO.map((f) => (
              <SelectItem key={f.campo} value={f.campo}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Input de Valor (renderização condicional baseada no fieldConfig.tipo) */}
      <div className="flex-grow w-full">
        {/* --- Condição para FILIAL (usando tipo 'filial-select') --- */}
        {fieldConfig.tipo === "filial-select" && (
          <FiltroFilialSelect
            // Garante que o valor passado seja sempre um array
            values={Array.isArray(filter.value) ? filter.value : []}
            // Passa o handler que espera receber o array de strings selecionadas
            setValues={handleValueChange}
          />
        )}

        {/* --- Tipo Texto --- */}
        {fieldConfig.tipo === "texto" && (
          <>
            <Label
              htmlFor={`value-input-${filter.id}`}
              className="text-xs mb-1 "
            >
              Valor
            </Label>
            <Input
              id={`value-input-${filter.id}`}
              placeholder={`Digite ${fieldConfig.label.toLowerCase()}...`}
              // Garante que value seja string para o input
              value={String(filter.value ?? "")}
              onChange={(e) => handleValueChange(e.target.value)}
            />
          </>
        )}

        {/* --- Tipo Data Range ou Número Range --- */}
        {(fieldConfig.tipo === "data-range" ||
          fieldConfig.tipo === "numero-range") && (
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <div className="flex-1">
              <Label
                htmlFor={`value-from-${filter.id}`}
                className="text-xs mb-1"
              >
                De
              </Label>
              <Input
                id={`value-from-${filter.id}`}
                type={fieldConfig.tipo === "data-range" ? "date" : "number"}
                placeholder="De"
                // Garante que o valor seja string para o input
                value={String(filter.value?.from ?? "")}
                // Usa handler específico para inputs de range
                onChange={(e) => handleRangeInputChange("from", e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor={`value-to-${filter.id}`} className="text-xs mb-1">
                Até
              </Label>
              <Input
                id={`value-to-${filter.id}`}
                type={fieldConfig.tipo === "data-range" ? "date" : "number"}
                placeholder="Até"
                // Garante que o valor seja string para o input
                value={String(filter.value?.to ?? "")}
                // Usa handler específico para inputs de range
                onChange={(e) => handleRangeInputChange("to", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* --- Tipo Select Simples --- */}
        {fieldConfig.tipo === "select" && (
          <>
            <Label
              htmlFor={`value-select-${filter.id}`}
              className="text-xs mb-1"
            >
              Opção
            </Label>
            <Select
              // Garante que o valor seja string
              value={String(filter.value ?? "")}
              onValueChange={handleValueChange} // Passa a string selecionada
            >
              <SelectTrigger id={`value-select-${filter.id}`}>
                <SelectValue
                  placeholder={`Selecione ${fieldConfig.label.toLowerCase()}`}
                />
              </SelectTrigger>
              <SelectContent>
                {/* Adiciona opção vazia para 'limpar' seleção */}
                <SelectItem value="">-- Limpar Seleção --</SelectItem>
                {fieldConfig.opcoes?.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )}

        {/* --- Tipo Select Múltiplo --- */}
        {fieldConfig.tipo === "select-multiple" && (
          <>
            <Label className="text-xs mb-1">Opções</Label>
            <MultiSelect
              // Assume que MultiSelect aceita estas props
              options={fieldConfig.opcoes || []}
              // Garante que o valor seja sempre um array de strings
              selected={
                Array.isArray(filter.value) ? filter.value.map(String) : []
              }
              // Passa o handler que espera receber o array de strings
              onChange={handleValueChange}
              placeholder={`Selecione ${fieldConfig.label.toLowerCase()}`}
              // className="w-full" // Ajuste conforme necessário
            />
          </>
        )}
      </div>

      {/* Botão Remover */}
      <div className="flex-shrink-0">
        <Label className="text-xs mb-1">Remover</Label>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onRemove(filter.id)} // Chama onRemove com o ID único
          aria-label="Remover filtro"
          className="hover:text-red-600 hover:border-red-600"
        >
          <TrashIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
