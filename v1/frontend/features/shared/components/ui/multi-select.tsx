"use client";

import React from "react";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
} from "ui"; // ajuste o caminho conforme necessário

interface MultiSelectProps {
    options: { value: string; label: string }[];
    value: string[];
    onChange: (value: string[]) => void;
    placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
                                                     options,
                                                     value,
                                                     onChange,
                                                     placeholder,
                                                 }) => {
    // Quando um item é selecionado, se já estiver no array, remove; caso contrário, adiciona.
    const handleSelect = (val: string) => {
        if (value.includes(val)) {
            onChange(value.filter((item) => item !== val));
        } else {
            onChange([...value, val]);
        }
    };

    // Cria o texto do trigger com os rótulos selecionados ou um placeholder.
    const displayValue =
        value.length > 0
            ? value
                .map((v) => options.find((o) => o.value === v)?.label || v)
                .join(", ")
            : placeholder || "Selecione...";

    return (
        <Select onValueChange={handleSelect}>
            <SelectTrigger className="w-[200px]">
                <span>{displayValue}</span>
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default MultiSelect;
