"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "utils";
import {
  Input,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "ui";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/*     Tipos                                                                   */
/* -------------------------------------------------------------------------- */

export interface ComboboxItem {
  value: string;
  label: string;
}

type InputProps = React.ComponentProps<typeof Input>;

interface ComboboxProps {
  /* ---------- dados ---------- */
  items: ComboboxItem[];
  onSelect: (value: string | null) => void;
  selectedValue?: string | null;

  /* ---------- UX ---------- */
  placeholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  disabledReason?: string;
  listMaxHeight?: string;

  /* ---------- personalização visual ---------- */
  /** Adiciona / sobrescreve classes do `<Input>` gatilho */
  triggerClassName?: string;
  /** Passa _qualquer_ prop suportada por `<Input>` */
  triggerProps?: InputProps;
  /** Render prop para trocar o gatilho por completo */
  renderTrigger?: (
    renderProps: {
      ref: React.Ref<HTMLInputElement>;
      value: string;
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
      onFocus: () => void;
      disabled: boolean;
    }
  ) => React.ReactNode;

  /* ---------- personalização lista ---------- */
  popoverClassName?: string;
  itemRender?: (item: ComboboxItem) => React.ReactNode;

  /* ---------- erro ---------- */
  error?: boolean;
  errorMessage?: string;
  onClearError?: () => void;

  /* ---------- wrapper ---------- */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*     Componente                                                              */
/* -------------------------------------------------------------------------- */

export function Combobox({
  items,
  onSelect,
  selectedValue,

  placeholder = "Digite para buscar…",
  emptyMessage = "Nenhum item encontrado.",
  disabled = false,
  disabledReason,
  listMaxHeight = "200px",

  triggerClassName,
  triggerProps,
  renderTrigger,

  popoverClassName,
  itemRender,

  error = false,
  errorMessage,
  onClearError,

  className,
}: ComboboxProps) {
  /* ---------------- estado interno ---------------- */
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const isDisabled = items.length === 0 || disabled;

  /* -------------- item selecionado -------------- */
  const selectedItem = React.useMemo(
    () => items.find((i) => i.value === selectedValue),
    [items, selectedValue]
  );

  /* -------------- filtra itens -------------- */
  const filteredItems = React.useMemo(() => {
    if (!inputValue) return items;
    const q = inputValue.toLowerCase();
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [items, inputValue]);

  /* -------------- sync input ← seleção externa -------------- */
  React.useEffect(() => {
    if (selectedItem) setInputValue(selectedItem.label);
  }, [selectedItem]);

  /* ---------------- handlers ------------------ */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // se usuário mudou texto, "des-seleciona"
    if (selectedItem && value !== selectedItem.label) {
      onSelect(null);
      onClearError?.();
    }

    if (value && !open) setOpen(true);
    if (!value) setOpen(false);
  };

  const handleInputFocus = () => {
    if (!isDisabled) setOpen(true);
    else if (disabledReason) toast.error(disabledReason);
  };

  const handleItemClick = (item: ComboboxItem) => {
    setInputValue(item.label);
    onSelect(item.value);
    onClearError?.();
    setOpen(false);
    inputRef.current?.blur();
  };

  /* ---------------------------------------------------------------------- */
  /*                                RENDER                                  */
  /* ---------------------------------------------------------------------- */

  /** Elemento que dispara o Popover */
  const triggerElement = renderTrigger ? (
    renderTrigger({
      ref: inputRef,
      value: inputValue,
      onChange: handleInputChange,
      onFocus: handleInputFocus,
      disabled: isDisabled,
    })
  ) : (
    <Input
      {...triggerProps} // sobrescreve primeiro
      ref={inputRef}
      type="text"
      placeholder={placeholder}
      value={inputValue}
      onChange={handleInputChange}
      onFocus={handleInputFocus}
      disabled={isDisabled}
      autoComplete="off"
      className={cn(
        "w-full",
        error && "border-destructive focus:ring-destructive/50 focus:ring-1",
        triggerClassName,
        triggerProps?.className
      )}
    />
  );

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      {/* ---------------- trigger ---------------- */}
      <PopoverAnchor asChild>
        <div className={cn("relative w-full", className)}>
          {triggerElement}

          {/* botão limpar */}
          {inputValue && !isDisabled && !renderTrigger && (
            <button
              type="button"
              aria-label="Limpar"
              onClick={() => {
                setInputValue("");
                onSelect(null);
                onClearError?.();
                setOpen(false);
                inputRef.current?.focus();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </PopoverAnchor>

      {/* ---------------- lista ---------------- */}
      <PopoverContent
        style={{
          width: inputRef.current?.offsetWidth
            ? `${inputRef.current.offsetWidth}px`
            : "auto",
          zIndex: 60,
        }}
        className={cn("w-full p-0", popoverClassName)}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          if (e.target === inputRef.current) e.preventDefault();
        }}
      >
        <Command shouldFilter={false}>
          <CommandList
            className="overflow-y-auto"
            style={{ maxHeight: listMaxHeight, minHeight: "100px" }}
          >
            {/* casos vazios */}
            {filteredItems.length === 0 && (
              <CommandEmpty className="py-3 px-4 text-center text-sm text-muted-foreground">
                {items.length === 0
                  ? "Não há itens disponíveis."
                  : emptyMessage}
              </CommandEmpty>
            )}

            <CommandGroup>
              {filteredItems.map((item) => {
                const isSelected = selectedValue === item.value;
                return (
                  <CommandItem
                    key={item.value}
                    onSelect={() => handleItemClick(item)}
                    className={cn(
                      "px-3 py-2 cursor-pointer text-sm",
                      "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      isSelected && "font-medium"
                    )}
                  >
                    {itemRender ? itemRender(item) : item.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>

      {/* erro */}
      {error && errorMessage && (
        <p className="text-[0.8rem] font-medium text-destructive mt-1">
          {errorMessage}
        </p>
      )}
    </Popover>
  );
}
