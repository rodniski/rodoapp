"use client";

import * as React from "react";
import { ChevronsUpDown, X } from "lucide-react"; // X pode ser útil para limpar
import { cn } from "utils";
import {
  Input, // Usaremos Input
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  Popover, // Popover ainda é útil para o dropdown
  PopoverContent,
  PopoverAnchor,
} from "ui";
import { toast } from "sonner";

export interface ComboboxItem {
  value: string;
  label: string;
}

interface ComboboxProps {
  items: ComboboxItem[];
  placeholder?: string;
  emptyMessage?: string;
  onSelect: (value: string | null) => void;
  selectedValue?: string | null; // Ainda relevante para saber o item selecionado
  // renderSelected não faz mais tanto sentido aqui, o valor do input mostrará o label
  disabled?: boolean;
  disabledReason?: string;
  itemRender?: (item: ComboboxItem) => React.ReactNode;
  error?: boolean;
  errorMessage?: string;
  onClearError?: () => void;
  className?: string; // Classe para o wrapper principal (Input + Popover)
  popoverClassName?: string;
  listMaxHeight?: string;
}

export function Combobox({
  items,
  placeholder = "Digite para buscar...",
  emptyMessage = "Nenhum item encontrado.",
  onSelect,
  selectedValue,
  disabled = false,
  disabledReason,
  itemRender,
  error = false,
  errorMessage,
  onClearError,
  className,
  popoverClassName,
  listMaxHeight = "200px",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const isDisabled = items.length === 0 || disabled;

  // Encontra o item selecionado baseado no 'selectedValue' vindo das props
  const selectedItem = React.useMemo(
    () => items.find((item) => item.value === selectedValue),
    [items, selectedValue]
  );

  // Filtra os itens baseado no que foi digitado no input
  const filteredItems = React.useMemo(() => {
    if (!inputValue) {
      return items; // Mostra todos se input vazio? Ou nenhum? Decidi mostrar todos.
    }
    const lowerCaseInput = inputValue.toLowerCase();
    return items.filter((item) =>
      item.label.toLowerCase().includes(lowerCaseInput)
    );
  }, [items, inputValue]);

  // Efeito para sincronizar o input com o valor selecionado externamente
  // ou quando um item é selecionado internamente.
  React.useEffect(() => {
    if (selectedItem) {
      setInputValue(selectedItem.label);
      // Não fechar o popover aqui, só sincronizar o texto
    }
    // Se selectedValue for null/undefined e o input não estiver focado, limpa input?
    // Isso pode ser complexo, depende do comportamento desejado.
    // Por ora, só sincroniza quando há seleção.
  }, [selectedItem]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputValue(value);
    // Se o usuário começar a digitar algo diferente do item selecionado,
    // podemos considerar que a seleção foi desfeita para iniciar nova busca.
    if (selectedItem && value !== selectedItem.label) {
      onSelect(null); // Informa o componente pai que a seleção foi limpa
      if (onClearError) onClearError(); // Limpa erro ao digitar
    }
    if (!open && value) {
      setOpen(true); // Abre o popover ao começar a digitar
    } else if (!value) {
      setOpen(false); // Fecha se apagar tudo
    }
  };

  const handleInputFocus = () => {
    if (!isDisabled) {
      setOpen(true); // Abre ao focar
    } else if (disabledReason) {
      toast.error(disabledReason);
    }
  };

  // Cuidado com onBlur: fechar imediatamente pode impedir cliques nos itens.
  // Popover do shadcn/ui geralmente lida bem com isso internamente se não for controlado externamente.
  // Vamos deixar o Popover controlar o fechamento no blur por enquanto.
  // const handleInputBlur = () => { setOpen(false); };

  const handleItemSelect = (item: ComboboxItem) => {
    setInputValue(item.label); // Atualiza o input com o label do item selecionado
    onSelect(item.value); // Chama o callback principal com o valor
    if (onClearError) onClearError(); // Limpa erro ao selecionar
    setOpen(false); // Fecha o popover
    inputRef.current?.blur(); // Tira o foco do input
  };

  return (
    // Usar PopoverAnchor para conectar PopoverContent ao Input
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverAnchor asChild>
        <div className={cn("relative w-full", className)}>
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            disabled={isDisabled}
            className={cn(
              error &&
                "border-destructive focus:ring-destructive/50 focus:ring-1"
            )}
            autoComplete="off"
          />
          {inputValue && !isDisabled && (
            <button
              type="button"
              onClick={() => {
                setInputValue("");
                onSelect(null);
                if (onClearError) onClearError();
                setOpen(false);
                inputRef.current?.focus();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
              aria-label="Limpar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </PopoverAnchor>

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
          if (e.target === inputRef.current) {
            e.preventDefault();
          }
        }}
      >
        <Command shouldFilter={false}>
          <CommandList
            className="overflow-y-auto"
            style={{ maxHeight: listMaxHeight, minHeight: "100px" }}
          >
            {filteredItems.length === 0 && inputValue && (
              <CommandEmpty className="py-3 px-4 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </CommandEmpty>
            )}
            {filteredItems.length === 0 && !inputValue && items.length > 0 && (
              <CommandEmpty className="py-3 px-4 text-center text-sm text-muted-foreground">
                Digite para buscar...
              </CommandEmpty>
            )}
            {items.length === 0 && (
              <CommandEmpty className="py-3 px-4 text-center text-sm text-muted-foreground">
                Não há itens disponíveis.
              </CommandEmpty>
            )}
            <CommandGroup>
              {filteredItems.map((item) => {
                const isSelected = selectedValue === item.value;
                return (
                  <CommandItem
                    key={item.value}
                    onSelect={() => handleItemSelect(item)}
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

      {/* Mensagem de erro */}
      {error && errorMessage && (
        <p className="text-[0.8rem] font-medium text-destructive mt-1">
          {errorMessage}
        </p>
      )}
    </Popover>
  );
}