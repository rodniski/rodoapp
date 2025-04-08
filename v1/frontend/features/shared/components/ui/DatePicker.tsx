"use client";

import * as React from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { CalendarIcon } from "lucide-react";
import { cn } from "lib";
import { Button, Popover, PopoverContent, PopoverTrigger } from "ui";
import { Calendar } from "ui";

dayjs.extend(customParseFormat);

function parseGenericDate(dateString: string): Date | null {
    if (!dateString || !dateString.trim()) return null;
    const formats = ["DD/MM/YYYY", "YYYYMMDD", "YYYY-MM-DD"];
    for (const fmt of formats) {
        const parsed = dayjs(dateString, fmt, true);
        if (parsed.isValid()) {
            return parsed.toDate();
        }
    }
    return null;
}

function formatDateDefault(date: Date | null): string {
    if (!date) return "";
    return dayjs(date).format("DD/MM/YYYY");
}

interface DatePickerProps {
    initialDate?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}

export function DatePicker({
                               initialDate = "",
                               onChange,
                               placeholder = "Selecione Data",
                           }: DatePickerProps) {
    const [date, setDate] = React.useState<Date | null>(parseGenericDate(initialDate));

    // Atualiza o estado sempre que a prop initialDate mudar
    React.useEffect(() => {
        const newDate = parseGenericDate(initialDate);
        setDate(newDate);
    }, [initialDate]);

    const handleDateSelect = (newDate: Date | undefined) => {
        setDate(newDate ?? null);
        if (onChange) {
            onChange(newDate ? formatDateDefault(newDate) : "");
        }
    };

    const buttonLabel = date ? formatDateDefault(date) : placeholder;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-[150px] justify-start text-left font-normal",
                        !date && "text-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {buttonLabel}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date ?? undefined}
                    onSelect={handleDateSelect}
                    showOutsideDays
                />
            </PopoverContent>
        </Popover>
    );
}
