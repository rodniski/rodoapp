"use client";

import React from "react";
import { Combobox, ComboboxItem } from "ui";

type FiltroSelectProps = {
  value: string;
  setValue: (val: string) => void;
  options: ComboboxItem[];
};

const FiltroSelect: React.FC<FiltroSelectProps> = ({ value, setValue, options }) => {
  const comboboxOptions: ComboboxItem[] = options.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

  return (
    <div className="min-w-[200px]">
      <Combobox
        items={comboboxOptions}
        placeholder="Selecione..."
        onSelect={(val) => setValue(val ?? "")}
      />
    </div>
  );
};

export default FiltroSelect;