"use client";

import React, { useEffect, useState } from "react";
import { useFiliaisStore } from "stores";
import { MultiSelect } from "ui";

type Option = {
  label: string;
  value: string;
};

type Props = {
  values: string[];
  setValues: (val: string[]) => void;
};

const FiltroFilialSelect: React.FC<Props> = ({ values, setValues }) => {
  const { filiais } = useFiliaisStore();
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (filiais?.length > 0) {
      const mapped = filiais
        .filter((f) => f.numero && f.filial)
        .map((f) => ({
          label: `${f.numero} - ${f.filial}`,
          value: f.numero,
        }));
      setOptions(mapped);
    }
  }, [filiais]);

  return (
    <div className="min-w-[240px] w-full">
      <MultiSelect
        options={options}
        selected={values}
        onChange={setValues}
        placeholder="Selecione a(s) Filial(is)"
      />
    </div>
  );
};

export default FiltroFilialSelect;