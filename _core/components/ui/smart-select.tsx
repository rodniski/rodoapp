"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem /* todos de “ui” */,
  Badge,
  Button,
} from "ui";
import { Check, ChevronsUpDown, XCircle } from "lucide-react";
import { cn } from "utils";
import type { ComboboxItem } from "ui";

/* ╭──────────────────────────────────────────╮
   │ 1 ▸ INTERFACES                           │
   ╰──────────────────────────────────────────╯ */
/* ─────────── props comuns ─────────── */
interface BaseProps {
  options: ComboboxItem[];
  placeholder?: string;
  className?: string;
  badgeClassName?: string;
}

/* ─────────── seleção única ─────────── */
export interface SingleSelectProps extends BaseProps {
  /** identifica o “modo” da prop union */
  multiple?: false;
  /** string (ou null) quando for _single_ */
  value: string | null;
  onChange: (val: string | null) => void;
}

/* ─────────── seleção múltipla ─────────── */
export interface MultiSelectProps extends BaseProps {
  multiple: true;
  value: string[];
  onChange: (vals: string[]) => void;
}

export type SmartSelectProps = SingleSelectProps | MultiSelectProps;

export function SmartSelect(props: SmartSelectProps) {
  const {
    options,
    placeholder = "Selecione…",
    className,
    badgeClassName,
  } = props;

  /* estado do pop-over */
  const [open, setOpen] = React.useState(false);

  /* helpers p/ saber seleções */
  const isMulti = props.multiple === true;
  const selectedValues: string[] = isMulti
    ? props.value
    : props.value
    ? [props.value]
    : [];

  const selectedOptions = React.useMemo(
    () => options.filter((o) => selectedValues.includes(o.value)),
    [options, selectedValues]
  );

  /* toggle (add/remove) */
  const handleSelect = (v: string) => {
    if (isMulti) {
      const already = props.value.includes(v);
      const next = already
        ? props.value.filter((x) => x !== v)
        : [...props.value, v];
      props.onChange(next);
    } else {
      /* single — fecha pop-over e devolve string (ou null para “limpar”) */
      const next = props.value === v ? null : v;
      props.onChange(next);
      setOpen(false);
    }
  };

  /* limpar */
  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    isMulti ? props.onChange([]) : props.onChange(null);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          ref={null}
          className={cn(
            "inline-flex h-9 w-full items-center justify-between rounded-md border border-input bg-muted/30 px-2 text-sm shadow-sm focus:outline-none",
            className
          )}
          onClick={() => setOpen(!open)}
        >
          <div className="flex flex-wrap gap-1 overflow-hidden">
            {selectedOptions.length ? (
              selectedOptions.map((o) => (
                <Badge
                  key={o.value}
                  variant={isMulti ? "outline" : "secondary"}
                  className={badgeClassName}
                >
                  {o.label}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <div className="ml-auto flex items-center gap-1 pl-2">
            {!!selectedOptions.length && (
              <XCircle
                className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
                onClick={clear}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Pesquisar…" />
          <CommandList>
            <CommandEmpty>Nenhum resultado.</CommandEmpty>
            <CommandGroup>
              {options.map((o) => (
                <CommandItem
                  key={o.value}
                  value={o.value}
                  onSelect={() => handleSelect(o.value)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-3 w-3",
                      selectedValues.includes(o.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {o.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
