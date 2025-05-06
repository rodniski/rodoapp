"use client";

import React from "react";
import type { DateRange } from "react-day-picker";
import { DatePicker } from "ui/date-picker"; // <- Nosso componente unificado
import { Combobox } from "ui";

type FiltroDataRangeProps = {
  /**
   * Em “between” (intervalo), `value = { from: Date; to: Date }`.
   * Em “day”, “before”, “after” => representamos como { from: singleDate, to: singleDate } ou undefined.
   */
  value?: DateRange;
  setValue: (val?: DateRange) => void;
};

const OPERADORES = [
  { value: "day", label: "No dia" },
  { value: "before", label: "Antes de" },
  { value: "after", label: "Depois de" },
  { value: "between", label: "Entre dias" },
];

export default function FiltroDataRange({ value, setValue }: FiltroDataRangeProps) {
  // Guarda o operador selecionado no combobox (“day”, “before”, “after”, “between”)
  const [operator, setOperator] = React.useState<string>("day");

  // Data única (para “day”, “before”, “after”)
  // Exibida quando operator !== "between"
  const [singleDate, setSingleDate] = React.useState<Date | undefined>(undefined);

  // Intervalo (para “between”)
  // Exibido quando operator === "between"
  const [range, setRange] = React.useState<DateRange | undefined>(value);

  // Sempre que operator, singleDate ou range mudam, atualizamos `setValue()`.
  React.useEffect(() => {
    if (operator === "between") {
      // “Entre dias” => passa o range pro pai
      setValue(range);
    } else {
      // “No dia”, “Antes de”, “Depois de” => interpretamos singleDate como { from, to } = { d, d }
      if (singleDate) {
        setValue({ from: singleDate, to: singleDate });
      } else {
        setValue(undefined);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operator, singleDate, range]);

  return (
    <div className="flex flex-col gap-2">
      {/* Combobox para escolher a operação */}
      <Combobox
        items={OPERADORES}
        placeholder="Selecione o tipo"
        onValueChange={(val) => setOperator(val)}
      />

      {operator === "between" ? (
        // Quando for “between”, exibimos DatePicker em modo range
        <DatePicker
          mode="range"
          value={range}
          onChange={(val) => setRange(val as DateRange)} // cast pois onChange retorna Date | DateRange
          placeholder="Selecione intervalo"
        />
      ) : (
        // Quando for “day”/“before”/“after”, exibimos DatePicker em modo single
        <DatePicker
          mode="single"
          value={singleDate}
          onChange={(val) => setSingleDate(val as Date)}
          placeholder="Selecione data"
        />
      )}
    </div>
  );
}