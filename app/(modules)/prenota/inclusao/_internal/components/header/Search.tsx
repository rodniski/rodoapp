"use client";

import {
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Command,
  CommandList,
  CommandGroup,
  CommandItem,
  Button,
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "ui";
import { History, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSearchXml } from "@inclusao/hooks";
import { useXmlHistoryStore, usePreNotaStore } from "@inclusao/stores";

export function XmlSearchInput() {
  const chvnf = usePreNotaStore((state) => state.draft.header.CHVNF);
  const [inputValue, setInputValue] = useState(chvnf || "");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const { searchAndPopulate, isLoading, error } = useSearchXml();
  const xmlHistory = useXmlHistoryStore((state) => state.xmlHistory);
  const setHeader = usePreNotaStore((state) => state.setHeader);

  const hasFiredSearch = useRef(false);

  useEffect(() => {
    if (inputValue.length === 44 && !hasFiredSearch.current) {
      hasFiredSearch.current = true;
      searchAndPopulate(inputValue);
      setHeader({ CHVNF: inputValue });
    }

    if (inputValue.length < 44 && hasFiredSearch.current) {
      hasFiredSearch.current = false;
    }
  }, [inputValue, searchAndPopulate, setHeader]);

  useEffect(() => {
    setInputValue(chvnf || "");
  }, [chvnf]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setInputValue(numericValue);
  };

  const handleManualSearch = (chave: string) => {
    if (chave.length === 44 && !isLoading) {
      searchAndPopulate(chave);
      setHeader({ CHVNF: chave });
    }
  };

  const handleSelectFromHistory = (chave: string) => {
    setInputValue(chave);
    setIsPopoverOpen(false);
    hasFiredSearch.current = true;
    searchAndPopulate(chave);
    setHeader({ CHVNF: chave });
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Chave NF‑e (44 dígitos)"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleManualSearch(inputValue);
            }
          }}
          className={`pr-10 ${
            error ? "border-destructive focus-visible:ring-destructive" : ""
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? "xml-search-error" : undefined}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center h-full">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-label="Carregando" />
          ) : error ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-destructive hover:bg-transparent"
                    aria-label={`Erro: ${error}`}
                  >
                    <AlertCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-destructive text-destructive-foreground">
                  <p>{error}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : xmlHistory.length > 0 ? (
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-transparent"
                  aria-label="Abrir histórico de chaves"
                >
                  <History className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="p-0 w-[450px]">
                <Command>
                  <CommandList>
                    <CommandGroup heading="Histórico Recente">
                      {xmlHistory.map((h) => (
                        <CommandItem
                          key={h}
                          onSelect={() => handleSelectFromHistory(h)}
                          className="cursor-pointer text-xs"
                          value={h}
                        >
                          {h}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          ) : null}
        </div>
      </div>
      {error && !isLoading && (
        <p id="xml-search-error" className="text-xs text-destructive mt-1 ml-1">
          {error}
        </p>
      )}
    </div>
  );
}