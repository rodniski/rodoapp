"use client";

import { TrashIcon } from "@radix-ui/react-icons";
import {
  Button,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "ui";
import { CAMPOS_FILTRO } from "@prenota/filtro";
import type { FilterRowProps } from "@prenota/filtro";
import { useFilterModalHandlers } from "../config";
import { useFilterRowLogic, renderValueControl } from "./logic.filter";

export const FilterRow: React.FC<FilterRowProps> = ({
  filter,
  onChange,
  onRemove,
}) => {
  const { filialOptions } = useFilterModalHandlers();
  const { cfg, handleFieldChange, handleValueChange } = useFilterRowLogic({
    filter,
    onChange,
    filialOptions,
  });

  if (!cfg) {
    console.error("[FilterRow] Campo não configurado:", filter.field);
    return null;
  }

  return (
    <div className="flex items-start gap-3">
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

      <div className="flex-1">
        <Label className="text-xs mb-1">{cfg.label}</Label>
        {renderValueControl({
          cfg,
          filter,
          onChange: handleValueChange,
          id: filter.id,
          filialOptions,
        })}
      </div>

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