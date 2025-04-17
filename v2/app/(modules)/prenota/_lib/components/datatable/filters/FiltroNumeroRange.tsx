"use client";

import React from "react";
import { Input } from "ui";

type NumeroRangeValue = {
  min?: string;
  max?: string;
};

type FiltroNumeroRangeProps = {
  /** Objeto contendo min e max como string (pode ser number se preferir) */
  value: NumeroRangeValue;

  /** Callback para atualizar o estado no pai */
  setValue: (val: NumeroRangeValue) => void;

  /**
   * Prefixo para exibir antes do valor.
   * Ex: "R$ ", "US$ ", ou "" se não quiser prefixo.
   */
  prefix?: string;
};

const FiltroNumeroRange: React.FC<FiltroNumeroRangeProps> = ({
  value,
  setValue,
  prefix = "",
}) => {
  // Handler para mudar o mínimo
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Remove prefixo e caracteres indesejados, se quiser
    const numeric = raw.replace(prefix, "");
    setValue({
      ...value,
      min: numeric,
    });
  };

  // Handler para mudar o máximo
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const numeric = raw.replace(prefix, "");
    setValue({
      ...value,
      max: numeric,
    });
  };

  return (
    <div className="inline-flex gap-2">
      <Input
        type="text"
        placeholder="Mínimo"
        value={prefix + (value.min || "")}
        onChange={handleMinChange}
      />
      <Input
        type="text"
        placeholder="Máximo"
        value={prefix + (value.max || "")}
        onChange={handleMaxChange}
      />
    </div>
  );
};

export default FiltroNumeroRange;