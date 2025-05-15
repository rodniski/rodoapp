/* ───────────────────────────  FilterRow.tsx  ───────────────────────────
 * Lógica e renderização do componente de linha de filtro para Pré-notas.
 *
 *  ┌────────────┐
 *  │  RESUMO    │  Gerencia a lógica de seleção de campos e valores para
 *  ├────────────┤  filtros, renderizando controles apropriados (texto,
 *  │  FUNCIONAL │  range, select) com base na configuração de CAMPOS_FILTRO.
 *  └────────────┘
 *  Usa SmartSelect para seletores e Input para entradas de texto/range.
 * -----------------------------------------------------------------------*/

import { useCallback, useMemo, useState, useEffect } from "react";
import { SmartSelect, Input, ComboboxItem, Label } from "ui";
import { CAMPOS_FILTRO } from "@/app/(modules)/prenota/_internal/filtro";
import type { PrenotaRow } from "@/app/(modules)/prenota/_internal/tabela";
import type { FilterRowProps, RangeValue, FilterValue } from "@/app/(modules)/prenota/_internal/filtro";

interface UseFilterRowLogicProps {
  filter: FilterRowProps["filter"];
  onChange: FilterRowProps["onChange"];
  filialOptions: ComboboxItem[];
}

interface ValueControlProps {
  cfg: (typeof CAMPOS_FILTRO)[number];
  filter: FilterRowProps["filter"];
  onChange: (val: unknown) => void;
  id: string;
  filialOptions: ComboboxItem[];
}

export function useFilterRowLogic({
  filter,
  onChange,
  filialOptions,
}: UseFilterRowLogicProps) {
  const cfg = useMemo(() => {
    const baseCfg = CAMPOS_FILTRO.find((f) => f.campo === filter.field);
    if (baseCfg?.campo === "F1_FILIAL") {
      return { ...baseCfg, opcoes: filialOptions };
    }
    return baseCfg;
  }, [filter.field, filialOptions]);

  const handleFieldChange = useCallback(
    (nextField: string) => {
      const nextCfg = CAMPOS_FILTRO.find((f) => f.campo === nextField);
      const empty: unknown = (() => {
        switch (nextCfg?.tipo) {
          case "select-multiple":
          case "filial-select":
            return [];
          case "data-range":
          case "numero-range":
            return { from: "", to: "" } satisfies RangeValue;
          default:
            return "";
        }
      })();
      onChange(filter.id, nextField as keyof PrenotaRow, empty as FilterValue);
    },
    [filter.id, onChange]
  );

  const handleValueChange = useCallback(
    (val: unknown) => onChange(filter.id, filter.field, val as FilterValue),
    [filter.id, filter.field, onChange]
  );

  return { cfg, handleFieldChange, handleValueChange };
}

// Converted to a proper React component to fix hook rules
export function ValueControl({
  cfg,
  filter,
  onChange,
  id,
  filialOptions,
}: ValueControlProps) {
  // Handle dynamic options for select controls
  const [resolvedOptions, setResolvedOptions] = useState<ComboboxItem[]>([]);

  useEffect(() => {
    if (cfg.opcoes) {
      if (typeof cfg.opcoes === "function") {
        cfg.opcoes().then((options) => setResolvedOptions(options));
      } else {
        setResolvedOptions(cfg.opcoes);
      }
    } else {
      setResolvedOptions([]);
    }
  }, [cfg, cfg.opcoes]); // Added cfg as a dependency

  // Render the appropriate control based on the filter type
  switch (cfg.tipo) {
    case "texto":
      return (
        <Input
          type={cfg.numeric ? "number" : "text"}
          placeholder="Digite o valor"
          value={(filter.value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
        />
      );

    case "data-range":
    case "numero-range":
      const inputType = cfg.tipo === "data-range" ? "date" : "number";
      const labelFrom = cfg.tipo === "data-range" ? "De" : "Mínimo";
      const labelTo = cfg.tipo === "data-range" ? "Até" : "Máximo";
      const value = (filter.value as RangeValue) ?? { from: "", to: "" };

      return (
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <div className="flex-1">
            <Label htmlFor={`${id}-from`} className="text-xs mb-1">
              {labelFrom}
            </Label>
            <Input
              id={`${id}-from`}
              type={inputType}
              placeholder={labelFrom}
              value={value.from ?? ""}
              onChange={(e) => onChange({ ...value, from: e.target.value })}
            />
          </div>
          <div className="flex-1">
            <Label htmlFor={`${id}-to`} className="text-xs mb-1">
              {labelTo}
            </Label>
            <Input
              id={`${id}-to`}
              type={inputType}
              placeholder={labelTo}
              value={value.to ?? ""}
              onChange={(e) => onChange({ ...value, to: e.target.value })}
            />
          </div>
        </div>
      );

    case "select":
      return (
        <SmartSelect
          multiple={false}
          value={(filter.value as string) ?? null}
          onChange={onChange as (val: string | null) => void}
          options={resolvedOptions}
          placeholder={`Selecione ${cfg.label.toLowerCase()}`}
        />
      );

    case "select-multiple":
    case "filial-select":
      return (
        <SmartSelect
          multiple={true}
          value={(filter.value as string[]) ?? []}
          onChange={onChange as (vals: string[]) => void}
          options={resolvedOptions}
          placeholder={`Selecione ${cfg.label.toLowerCase()}`}
        />
      );

    default:
      return null;
  }
}

// For backward compatibility, keep a function that renders the component
export function renderValueControl(props: ValueControlProps) {
  return <ValueControl {...props} />;
}
