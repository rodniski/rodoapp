"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { CalendarIcon } from "lucide-react";

import { cn } from "utils";
import { Button } from "ui/button";
import { Calendar } from "ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "ui/popover";

type Mode = "single" | "range";

type DatePickerGenericProps = {
  /** single → seleciona 1 data | range → seleciona intervalo */
  mode?: Mode;

  /** Valor atual. Se mode=single, é Date ou undefined; se mode=range, é { from?: Date; to?: Date } ou undefined */
  value?: Date | DateRange;

  /** Callback quando o usuário seleciona datas */
  onChange?: (val: Date | DateRange | undefined) => void;

  /** Placeholder quando não há data selecionada */
  placeholder?: string;

  /** Se quiser multiple months lado a lado (ex.: 1, 2) */
  numberOfMonths?: number;

  /** Se true, datas anteriores a hoje ficam desabilitadas */
  disableBeforeToday?: boolean;
  disabled?: boolean;
  className?: string;
};

/**
 * Componente unificado que aceita `mode="single"` ou `"range"`.
 * Exibe data única ou intervalo de datas, sempre com pt-BR.
 */
export function DatePicker({
  mode = "single",
  value,
  onChange,
  placeholder,
  numberOfMonths = mode === "range" ? 2 : 1,
  disableBeforeToday = false,
  disabled = false,
  className,
}: DatePickerGenericProps) {
  const [open, setOpen] = React.useState(false);

  let selected: Date | DateRange | undefined;
  if (mode === "single") {
    selected = (value as Date) ?? undefined;
  } else {
    selected = (value as DateRange) ?? { from: undefined, to: undefined };
  }

  let buttonLabel = placeholder || (mode === "range" ? "Selecione intervalo" : "Selecione data");

  if (mode === "single" && selected instanceof Date) {
    buttonLabel = format(selected, "dd/MM/yyyy", { locale: ptBR });
  } else if (mode === "range" && typeof selected === "object") {
    const range = selected as DateRange;
    if (range.from) {
      buttonLabel = range.to
        ? `${format(range.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(range.to, "dd/MM/yyyy", { locale: ptBR })}`
        : format(range.from, "dd/MM/yyyy", { locale: ptBR });
    }
  }

  const handleSelect = (sel: Date | DateRange | undefined) => {
    if (!disabled) onChange?.(sel);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={(open) => !disabled && setOpen(open)}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
              disabled && "opacity-60 cursor-not-allowed"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {buttonLabel}
          </Button>
        </PopoverTrigger>

        {!disabled && (
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              locale={ptBR}
              mode={mode}
              numberOfMonths={numberOfMonths}
              selected={selected}
              onSelect={handleSelect}
              defaultMonth={
                mode === "range" && typeof selected === "object"
                  ? (selected as DateRange).from
                  : undefined
              }
              disabled={disableBeforeToday ? { before: new Date() } : undefined}
            />
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}