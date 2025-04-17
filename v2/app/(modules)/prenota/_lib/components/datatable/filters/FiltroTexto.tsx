"use client";

import { Input } from "ui";
import React from "react";
import { Combobox } from "ui";

type Props = {
  value: string;
  onChange: (value: string) => void;
  comparador: string;
  setComparador: (c: string) => void;
};

const comparadores = [
  { value: "contém", label: "Contém" },
  { value: "igual", label: "Igual" },
  { value: "diferente", label: "Diferente" },
  { value: "começa", label: "Começa com" },
  { value: "termina", label: "Termina com" },
];

const FiltroTexto = ({ value, onChange, comparador, setComparador }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row w-1/2 gap-2">
      <Combobox
        items={comparadores}
        onSelect={(val) => setComparador(val ?? "")}
        selectedValue={comparador}
        placeholder="Operador..."
        className="w-full"
      />
      <Input
        type="text"
        placeholder="Digite o valor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

export default FiltroTexto;