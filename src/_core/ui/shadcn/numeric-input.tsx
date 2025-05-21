"use client";

import type React from "react";
import {useEffect, useRef, useState} from "react";

interface NumericInputProps {
    value: number;
    min: number;
    max: number;
    onChange: (newValue: number) => void;
    className?: string;
}

export function NumericInput({value: initialValue, min, max, onChange}: NumericInputProps) {
    const [value, setValue] = useState(initialValue);
    const otpRef = useRef<HTMLInputElement>(null);

    const handleIncrement = () => {
        if (value < max) {
            const newValue = value + 1;
            setValue(newValue);
            onChange(newValue);
        }
    };

    const handleDecrement = () => {
        if (value > min) {
            const newValue = value - 1;
            setValue(newValue);
            onChange(newValue);
        }
    };

    const handleOTPChange = (newValue: string) => {
        const numericValue = Number.parseInt(newValue) || min;
        const clampedValue = Math.min(Math.max(numericValue, min), max);
        setValue(clampedValue);
        onChange(clampedValue);
    };

    // Sincronizar o valor inicial com o InputOTPSlot
    useEffect(() => {
        setValue(initialValue);
        if (otpRef.current) {
            otpRef.current.value = initialValue.toString();
        }
    }, [initialValue]);

    return (
        <div className={`grid grid-cols-3 h-10 w-24 rounded bg-background border gap-2 `} role="group"
             aria-label="Contador numérico">
            <button
                onClick={handleDecrement}
                className="border-r col-span-1 p-1 disabled:text-foreground/30 disabled:bg-muted/60"
                disabled={value <= min}
                aria-label="Diminuir quantidade"
            >
                -
            </button>
            <input
                ref={otpRef}
                value={value.toString()}
                onChange={(e) => handleOTPChange(e.target.value)}
                className="text-center bg-transparent col-span-1 w-full focus:outline-none"
                min={min}
                max={max}

            />
            <button
                onClick={handleIncrement}
                disabled={value >= max}
                className="border-l col-span-1 p-1 disabled:text-foreground/30 disabled:bg-muted/60"
            >
                +
            </button>
        </div>
    );
}
