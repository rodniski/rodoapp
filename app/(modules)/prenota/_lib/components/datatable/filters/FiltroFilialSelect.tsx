"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/app/login/_lib/stores/auth-store";
import { Label, MultiSelect } from "ui";
import { FilialAcesso } from "@/app/login/_lib";

type Option = {
  label: string;
  value: string;
};

type Props = {
  values: string[] | undefined; // Permitir undefined
  setValues: (val: string[]) => void;
};

const FiltroFilialSelect: React.FC<Props> = ({ values = [], setValues }) => {
  const { filiais, isLoading } = useAuthStore();
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

      // Filtra valores inválidos
      const validValues = (values || []).filter((v) =>
        mapped.some((opt) => opt.value === v)
      );
      if (validValues.length !== (values || []).length) {
        setValues(validValues);
      }
    }
  }, [filiais, values, setValues]);

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Carregando filiais...</div>
    );
  }

  return (
    <div className="min-w-[240px] w-full">
      <div className="flex w-full justify-between items-center">
        <Label className="text-xs mb-1">Filiais</Label>
        {values.length > 0 && (
          <div className="text-xs text-muted-foreground mt-1">
            {values.length} filial{values.length > 1 ? "is" : ""} selecionada
            {values.length > 1 ? "s" : ""}
          </div>
        )}
      </div>
      <MultiSelect
        options={options}
        selected={values || []}
        onChange={setValues}
        placeholder="Selecione a(s) Filial(is)"
        badgeClassName="text-xs px-1.5 py-0.5 m-0.5"
      />
    </div>
  );
};

export default FiltroFilialSelect;
