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
import { HoverCard, HoverCardContent, HoverCardTrigger } from "ui";

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

    // Reserva espaço para botão de limpar e chevron
    totalWidth += 56;

    for (let i = 0; i < selectedOptions.length; i++) {
      const badge = document.createElement("div");
      badge.className = badgeClassName || "px-2 py-1 m-1";
      badge.innerText = selectedOptions[i].label;
      tempDiv.appendChild(badge);

      totalWidth += badge.offsetWidth;

      if (totalWidth > triggerWidth - 30) {
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

  // Filiais ocultas para o tooltip
  const hiddenSelections = selectedOptions.slice(visibleSelections.length);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          ref={triggerRef}
          role="combobox"
          aria-expanded={open}
          tabIndex={0}
          className={cn(
            "w-full justify-between inline-flex items-center rounded-md border border-input bg-muted/30 h-9 px-2 text-sm shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
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
                    variant="outline"
                    className={cn(badgeClassName)}
                  >
                    {option.label}
                  </Badge>
                ))}
                {hiddenCount > 0 && (
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Badge
                        variant="secondary"
                        className={cn("px-2 py-0.5", badgeClassName)}
                      >
                        +{hiddenCount}
                      </Badge>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-auto max-w-xs">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Filiais ocultas:</p>
                        <ul className="text-xs">
                          {hiddenSelections.map((option) => (
                            <li key={option.value} className="truncate">
                              {option.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
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
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClear(e as any);
                  }
                }}
                className="h-8 px-2 mr-1 inline-flex items-center justify-center cursor-pointer hover:bg-transparent"
                aria-label="Limpar seleções"
              >
                <XCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </span>
            )}
            <ChevronsUpDown
              className="h-4 w-4 shrink-0 opacity-50"
              aria-hidden="true"
            />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Pesquisar..." />
          <CommandList>
            <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
            <CommandGroup>
              {options.map((option, index) => (
                <CommandItem
                  key={`${option.value}-${index}`}
                  value={option.value ?? `item-${index}`}
                  onSelect={() => handleSelect(option.value)}
                >
                  <div className="flex items-center w-full">
                    <Check
                      className={cn(
                        "mr-2 size-3",
                        selected.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                      aria-hidden="true"
                    />
                    <span className="truncate">{option.label}</span>
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
