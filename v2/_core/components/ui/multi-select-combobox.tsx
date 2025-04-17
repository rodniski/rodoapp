"use client";

import * as React from "react";
import { Check, ChevronsUpDown, XCircle } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "ui";
import { Popover, PopoverContent, PopoverTrigger } from "ui";
import { Badge } from "ui";
import { Button } from "ui";
import { cn } from "utils";

export type Option = {
  label: string;
  value: string;
};

type MultiSelectProps = {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  badgeClassName?: string;
};

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select items",
  className,
  badgeClassName,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const [visibleSelections, setVisibleSelections] = React.useState<Option[]>(
    []
  );
  const [hiddenCount, setHiddenCount] = React.useState(0);

  const selectedOptions = React.useMemo(
    () => options.filter((option) => selected.includes(option.value)),
    [options, selected]
  );

  const calculateVisibleSelections = React.useCallback(() => {
    if (!triggerRef.current || selectedOptions.length === 0) {
      setVisibleSelections([]);
      setHiddenCount(0);
      return;
    }

    const triggerWidth = triggerRef.current.offsetWidth;
    const tempDiv = document.createElement("div");
    tempDiv.style.visibility = "hidden";
    tempDiv.style.position = "absolute";
    tempDiv.style.display = "flex";
    tempDiv.style.width = `${triggerWidth}px`;
    document.body.appendChild(tempDiv);

    let totalWidth = 0;
    let visibleCount = 0;

    // Add clear button and chevron widths
    totalWidth += 56; // Approximate width for clear button and chevron

    for (let i = 0; i < selectedOptions.length; i++) {
      const badge = document.createElement("div");
      badge.className = badgeClassName || "px-2 py-1 m-1";
      badge.innerText = selectedOptions[i].label;
      tempDiv.appendChild(badge);

      totalWidth += badge.offsetWidth;

      if (totalWidth > triggerWidth - 30) {
        // Leave space for the +X badge
        break;
      }

      visibleCount = i + 1;
    }

    document.body.removeChild(tempDiv);

    setVisibleSelections(selectedOptions.slice(0, visibleCount));
    setHiddenCount(Math.max(0, selectedOptions.length - visibleCount));
  }, [selectedOptions, badgeClassName]);

  React.useLayoutEffect(() => {
    calculateVisibleSelections();
  }, [calculateVisibleSelections]);

  React.useEffect(() => {
    const handleResize = () => calculateVisibleSelections();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [calculateVisibleSelections]);

  const handleSelect = (value: string) => {
    const newSelected = selected.includes(value)
      ? selected.filter((item) => item !== value)
      : [...selected, value];
    onChange(newSelected);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          ref={triggerRef}
          role="button"
          aria-expanded={open}
          tabIndex={0}
          className={cn(
            "w-full justify-between inline-flex items-center rounded-md border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
            className
          )}
          onClick={() => setOpen(!open)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setOpen(!open);
            }
          }}
        >
          <div className="flex flex-1 flex-wrap items-center gap-1 overflow-hidden">
            {visibleSelections.length > 0 ? (
              <>
                {visibleSelections.map((option) => (
                  <Badge
                    key={option.value}
                    variant="secondary"
                    className={cn("mr-1 px-2 py-0.5", badgeClassName)}
                  >
                    {option.label}
                  </Badge>
                ))}
                {hiddenCount > 0 && (
                  <Badge variant="secondary" className="px-2 py-0.5">
                    +{hiddenCount}
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <div className="flex items-center">
            {selected.length > 0 && (
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear(e as any);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") handleClear(e as any);
                }}
                className="h-8 px-2 mr-1 inline-flex items-center justify-center cursor-pointer hover:bg-transparent"
              >
                <XCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                <span className="sr-only">Limpar</span>
              </span>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option, index) => (
                <CommandItem
                  key={`${option.value}-${index}`} // garante unicidade
                  value={option.value ?? `item-${index}`} // fallback se value vier undefined
                  onSelect={() => handleSelect(option.value)}
                >
                  <div className="flex items-center">
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
