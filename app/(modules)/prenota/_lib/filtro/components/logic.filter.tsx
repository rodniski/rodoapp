import { useCallback, useMemo } from "react";
import { SmartSelect, Input, ComboboxItem, Label } from "ui";
import { CAMPOS_FILTRO } from "@prenota/config";
import type { PrenotaRow } from "@prenota/tabela";
import type { FilterRowProps, RangeValue } from "@prenota/filtro";

interface UseFilterRowLogicProps {
  filter: FilterRowProps["filter"];
  onChange: FilterRowProps["onChange"];
  filialOptions: ComboboxItem[];
}

interface RenderValueControlProps {
  cfg: (typeof CAMPOS_FILTRO)[number];
  filter: FilterRowProps["filter"];
  onChange: (val: unknown) => void;
  id: string;
  filialOptions: ComboboxItem[];
}

export function useFilterRowLogic({ filter, onChange, filialOptions }: UseFilterRowLogicProps) {
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
      onChange(filter.id, nextField as keyof PrenotaRow, empty);
    },
    [filter.id, onChange]
  );

  const handleValueChange = useCallback(
    (val: unknown) => onChange(filter.id, filter.field, val),
    [filter.id, filter.field, onChange]
  );

  return { cfg, handleFieldChange, handleValueChange };
}

export function renderValueControl({
  cfg,
  filter,
  onChange,
  id,
  filialOptions,
}: RenderValueControlProps) {
  switch (cfg.tipo) {
    case "texto":
      return (
        <Input
          type="text"
          placeholder="Digite o valor"
          value={filter.value as string}
          onChange={(e) => onChange(e.target.value)}
          className="w-full"
        />
      );

    case "data-range":
    case "numero-range":
      const inputType = cfg.tipo === "data-range" ? "date" : "number";
      const labelFrom = cfg.tipo === "data-range" ? "De" : "Mínimo";
      const labelTo = cfg.tipo === "data-range" ? "Até" : "Máximo";
      const value = filter.value as RangeValue;

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
          options={cfg.opcoes ?? []}
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
          options={cfg.opcoes ?? []}
          placeholder={`Selecione ${cfg.label.toLowerCase()}`}
        />
      );

    default:
      return null;
  }
}