"use client"

import { Check, ChevronsUpDown, X } from "lucide-react"
import { Popover } from "@radix-ui/react-popover"
import * as React from "react"
import { cn } from "lib"
import {
    Badge,
    Button,
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    PopoverContent,
    PopoverTrigger,
} from "ui"

export type OptionType = {
    label: string
    value: string
}

interface MultiSelectFilterProps {
    options: OptionType[]
    selected: string[]
    onChange: (values: string[]) => void
    placeholder: string
    valueKey?: keyof OptionType
    labelKey?: keyof OptionType
}

export function MultiSelectFilter({
                                      options,
                                      selected,
                                      onChange,
                                      placeholder,
                                      valueKey = "value",
                                      labelKey = "label",
                                  }: MultiSelectFilterProps) {
    const [open, setOpen] = React.useState(false)

    const handleSelect = (value: string) => {
        const updatedSelected = selected.includes(value)
            ? selected.filter((item) => item !== value)
            : [...selected, value]
        onChange(updatedSelected)
    }

    const getLabel = (value: string) => {
        const option = options.find((opt) => opt[valueKey] === value)
        return option ? option[labelKey] : value
    }

    return (
        <div className="flex flex-col">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-between">
                        {`${placeholder} (${selected.length})`}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
                        <CommandList>
                            <CommandEmpty>No {placeholder.toLowerCase()} found.</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => (
                                    <CommandItem
                                        key={option[valueKey]}
                                        onSelect={() => handleSelect(option[valueKey])}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selected.includes(option[valueKey]) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {option[labelKey]}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <div className="flex flex-wrap gap-1">
                {selected.map((value) => (
                    <Badge key={value} variant="secondary">
                        {getLabel(value)}
                        <button
                            className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSelect(value)
                                }
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            onClick={() => handleSelect(value)}
                        >
                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>
    )
}
