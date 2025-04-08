import type React from "react";
import type { InputHTMLAttributes } from "react";
import { Input } from "ui";

interface CurrencyInputProps extends InputHTMLAttributes<HTMLInputElement> {
  value: number;
  onChange: (value: number) => void;
}

export function CurrencyInput({
  value,
  onChange,
  ...props
}: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseFloat(e.target.value);
    onChange(isNaN(newValue) ? 0 : newValue);
  };

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-gray-500 sm:text-sm">R$</span>
      </div>
      <Input
        {...props}
        type="number"
        value={value}
        onChange={handleChange}
        className="pl-9 text-right"
        step="0.01"
        min="0"
      />
    </div>
  );
}
