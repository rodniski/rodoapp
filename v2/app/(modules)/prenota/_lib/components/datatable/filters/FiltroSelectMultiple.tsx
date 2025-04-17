"use client";

import React from "react";
import { MultiSelect } from "ui"; // Assumindo que você exporta como 'MultiSelect'

type Option = {
  label: string;
  value: string;
};

type Props = {
  values: string[];
  setValues: (v: string[]) => void;
  options: Option[];
};

const FiltroSelectMultiple: React.FC<Props> = ({ values, setValues, options }) => {
  const safeOptions = options
    .filter((opt) => !!opt.value && !!opt.label)
    .map((opt) => ({
      label: opt.label,
      value: opt.value,
    }));

  return (
    <div className="min-w-[240px] w-full">
      <MultiSelect
        options={safeOptions}
        selected={values}
        onChange={setValues}
        placeholder="Selecionar..."
      />
    </div>
  );
};

export default FiltroSelectMultiple;