"use client";

import React, { useCallback, useMemo } from "react";
import { TrashIcon } from "@radix-ui/react-icons";
import {
  Button,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SmartSelect,
  Input,
  ComboboxItem,
} from "ui";

import { CAMPOS_FILTRO } from "@prenota/config";
import type { PrenotaRow } from "@prenota/tabela";
import type { FilterRowProps, RangeValue } from "@prenota/filtro";

export const FilterRow: React.FC<FilterRowProps> = ({
  filter,
  onChange,
  onRemove,
}) => {
  /* ─── 1. config do campo ───────────────────────────────────────── */
  const cfg = useMemo(
    () => CAMPOS_FILTRO.find((f) => f.campo === filter.field),
    [filter.field]
  );

  if (!cfg) {
    console.error("[FilterRow] Campo não configurado:", filter.field);
    return null;
  }

  /* ─── 2. handlers ─────────────────────────────────────────────── */
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

  /* ─── 3. decide o componente de valor (via switch) ─────────────── */
  const valueControl = (() => {
    switch (cfg.tipo) {
      case "texto":
        return (
          <Input
            type="text"
            placeholder="Digite o valor"
            value={filter.value as string}
            onChange={(e) => onChange(filter.id, filter.field, e.target.value)}
            className="w-full"
          />
        );

      case "data-range":
      case "numero-range":
        return (
          <div
            className={`flex flex-col sm:flex-row gap-2 w-full ${className}`}
          >
            {/* FROM ------------------------------------------------------------- */}
            <div className="flex-1">
              <Label htmlFor={`${id}-from`} className="text-xs mb-1">
                {labelFrom}
              </Label>
              <Input
                id={`${id}-from`}
                type={inputType}
                placeholder={labelFrom}
                value={value.from ?? ""}
                onChange={handleChange("from")}
              />
            </div>

            {/* TO --------------------------------------------------------------- */}
            <div className="flex-1">
              <Label htmlFor={`${id}-to`} className="text-xs mb-1">
                {labelTo}
              </Label>
              <Input
                id={`${id}-to`}
                type={inputType}
                placeholder={labelTo}
                value={value.to ?? ""}
                onChange={handleChange("to")}
              />
            </div>
          </div>
        );

      case "select":
      case "select-multiple":
      case "filial-select":
        return (
          <SmartSelect
            /* simples × múltiplo */
            multiple={cfg.tipo !== "select"}
            value={
              cfg.tipo === "select"
                ? (filter.value as string) ?? null
                : (filter.value as string[]) ?? []
            }
            onChange={handleValueChange as any}
            options={cfg.opcoes as ComboboxItem[]}
            placeholder={`Selecione ${cfg.label.toLowerCase()}`}
          />
        );

      default:
        return null;
    }
  })();

  /* ─── 4. render ────────────────────────────────────────────────── */
  return (
    <div className="flex items-start gap-3">
      {/* campo (select da coluna) */}
      <div className="w-full sm:w-48 shrink-0">
        <Label htmlFor={`field-${filter.id}`} className="text-xs mb-1">
          Campo
        </Label>
        <Select value={filter.field} onValueChange={handleFieldChange}>
          <SelectTrigger id={`field-${filter.id}`}>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {CAMPOS_FILTRO.map((f) => (
              <SelectItem key={f.campo} value={f.campo}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* valor (control + label herdado) */}
      <div className="flex-1">
        <Label className="text-xs mb-1">{cfg.label}</Label>
        {valueControl}
      </div>

      {/* remover */}
      <div className="shrink-0">
        <Label className="text-xs mb-1 opacity-0">Remover</Label>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onRemove(filter.id)}
          aria-label="Remover filtro"
          className="hover:text-red-600 hover:border-red-600"
        >
          <TrashIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};
