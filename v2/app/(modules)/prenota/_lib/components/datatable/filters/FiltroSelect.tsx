"use client";

import React from "react";
import { Combobox } from "ui";

type FiltroSelectProps = {
  value: string;
  setValue: (val: string) => void;
  options: ComboboxOption[];
};

const FiltroSelect: React.FC<FiltroSelectProps> = ({ value, setValue, options }) => {
  const comboboxOptions: ComboboxOption[] = options.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

  return (
    <div className="min-w-[200px]">
      <Combobox
        items={comboboxOptions}
        placeholder="Selecione..."
        onSelect={setValue}
      />
    </div>
  );
};

export default FiltroSelect;