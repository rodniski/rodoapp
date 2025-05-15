"use client";

import { ZoomInIcon, PlusIcon } from "@radix-ui/react-icons";
import { FilterRow } from "./row.filter";
import { useFilterModalHandlers } from "../config";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  Button,
  ScrollArea,
  Card,
} from "ui";

export function DataTableFilterModal() {
  const {
    isOpen,
    setIsOpen,
    internalFilters,
    handleAddFilter,
    handleChangeFilter,
    handleRemoveFilter,
    handleApply,
    handleClear,
    hasActiveLocalFilters,
    appliedFilters,
  } = useFilterModalHandlers();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 px-3"
          aria-label="Abrir modal de filtros"
        >
          <ZoomInIcon className="size-4" />
          <span>Filtrar</span>
          {Object.keys(appliedFilters || {}).length > 0 ? (
            <span className="ml-1.5 inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
              {Object.keys(appliedFilters).length}
            </span>
          ) : null}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Filtrar Pré-notas</DialogTitle>
          <DialogDescription>
            Adicione ou remova filtros para refinar os resultados.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddFilter}
              className="gap-1 w-full sm:w-auto"
              aria-label="Adicionar novo filtro"
            >
              <PlusIcon className="size-4" />
              Adicionar Filtro
            </Button>
          </div>

          <Card className="overflow-hidden max-h-[50vh] px-2 py-4">
            <ScrollArea
              className="h-full overflow-auto"
              role="region"
              aria-label="Lista de filtros"
            >
              {internalFilters.length > 0 ? (
                <div className="divide-y divide-border/40">
                  {internalFilters.map((filter) => (
                    <div className="px-3 first:pt-0 last:pb-0" key={filter.id}>
                      <FilterRow
                        filter={filter}
                        onChange={handleChangeFilter}
                        onRemove={handleRemoveFilter}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6 px-4">
                  Nenhum filtro adicionado. Clique em "Adicionar Filtro" acima.
                </p>
              )}
            </ScrollArea>
          </Card>
        </div>

        <DialogFooter className="mt-2 flex flex-row justify-between sm:justify-between border-t pt-4 px-1 pb-1">
          <Button
            variant="destructive"
            onClick={handleClear}
            disabled={!hasActiveLocalFilters}
            aria-label="Limpar todos os filtros"
          >
            Limpar Filtros
          </Button>
          <Button
            onClick={handleApply}
            disabled={!hasActiveLocalFilters}
            className="text-white"
            aria-label="Aplicar filtros selecionados"
          >
            Aplicar Filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}