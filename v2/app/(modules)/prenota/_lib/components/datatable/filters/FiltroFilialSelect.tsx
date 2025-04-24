"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@login/stores/auth-store";
import { MultiSelect } from "ui";
import { FilialAcesso } from "@/app/(modules)/login/_lib";

type Option = {
  label: string;
  value: string;
};

type Props = {
  values: string[];
  setValues: (val: string[]) => void;
};

const FiltroFilialSelect: React.FC<Props> = ({ values, setValues }) => {
  const { filiais } = useAuthStore();
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    if (filiais?.length > 0) {
      const mapped = filiais
        .filter((f: FilialAcesso) => f.M0_CODFIL && f.M0_FILIAL)
        .map((f: FilialAcesso) => ({
          label: `${f.M0_CODFIL} - ${f.M0_FILIAL}`,
          value: f.M0_CODFIL,
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