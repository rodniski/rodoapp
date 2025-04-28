/**
 * _lib/components/stepper/header/XmlSearchInput.tsx (ou @inclusao/components/...)
 *
 * Componente de Input para busca de NFe por chave de 44 dígitos.
 * Utiliza o hook useSearchXml para disparar a busca e gerenciar estados.
 * Exibe histórico de buscas recentes e feedback de loading/erro.
 * Controla o disparo automático da busca para evitar loops.
 */
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
} from "ui"; // Seus componentes UI, ajuste o path se necessário
import { History, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react"; // useRef é crucial para o controle de disparo
import { useSearchXml } from "@inclusao/hooks"; // Hook principal de busca XML
import { useXmlHistoryStore } from "@inclusao/stores"; // Store auxiliar para histórico

export function XmlSearchInput() {
  const [inputValue, setInputValue] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Hook de busca: retorna função para buscar e estados de loading/erro
  const { searchAndPopulate, isLoading, error } = useSearchXml();
  // Lê o histórico do store auxiliar
  const xmlHistory = useXmlHistoryStore((state) => state.xmlHistory);

  // --- Controle de Disparo Automático ---
  // Ref para controlar se a busca já foi disparada para o valor atual de 44 dígitos
  const hasFiredSearch = useRef(false);

  useEffect(() => {
    // Dispara a busca se tiver 44 dígitos e a flag NÃO estiver ativa
    if (inputValue.length === 44 && !hasFiredSearch.current) {
      console.log("useEffect disparando busca automática para:", inputValue);
      hasFiredSearch.current = true; // Ativa a flag para este valor
      searchAndPopulate(inputValue); // Chama a busca
    }

    // Reseta a flag se o comprimento for menor que 44
    if (inputValue.length < 44 && hasFiredSearch.current) {
       console.log("Resetando flag 'hasFiredSearch'");
       hasFiredSearch.current = false;
    }
    // Depende do valor do input e da função de busca (estável via useCallback no hook)
  }, [inputValue, searchAndPopulate]);
  // --- Fim do Controle de Disparo ---

  // Limpa caracteres não numéricos ao digitar
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/\D/g, "");
    setInputValue(numericValue);
  };

  // Permite forçar a busca com Enter (mesmo se já disparada automaticamente)
  const handleManualSearch = (chave: string) => {
      if (chave.length === 44 && !isLoading) { // Só busca se tiver 44 e não estiver carregando
          console.log("Disparando busca manual (Enter) para:", chave);
          searchAndPopulate(chave);
      }
  };

   // Lida com a seleção de um item do histórico
  const handleSelectFromHistory = (chave: string) => {
    setInputValue(chave); // Preenche o input
    setIsPopoverOpen(false); // Fecha o popover
    hasFiredSearch.current = true; // Marca como "disparado" para evitar trigger do useEffect
    searchAndPopulate(chave); // Dispara a busca imediatamente
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center space-x-2">
        {/* Input Principal */}
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
          maxLength={44}
          className={`pr-10 ${
            error ? "border-destructive focus-visible:ring-destructive" : ""
          }`}
          aria-invalid={!!error}
          aria-describedby={error ? "xml-search-error" : undefined}
        />

        {/* Ícones à Direita: Loader, Erro ou Histórico */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground flex items-center h-full">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-label="Carregando" />
          ) : error ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-6 w-6 p-0 text-destructive hover:bg-transparent" aria-label={`Erro: ${error}`}>
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
                          value={h} // Para busca interna do Command
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
      {/* Exibição de erro textual abaixo do input */}
       {error && !isLoading && (
            <p id="xml-search-error" className="text-xs text-destructive mt-1 ml-1">{error}</p>
        )}
    </div>
  );
}