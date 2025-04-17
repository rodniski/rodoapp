"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  Button,
  DialogDescription,
} from "ui";
import { useState, useEffect } from "react";
import { ZoomInIcon } from "@radix-ui/react-icons";
import { useDataTableStore } from "ui/data-table";
import { CAMPOS_FILTRO } from "@prenota/stores";
import type { CampoFiltro } from "@prenota/types";
import {
  FiltroDataRange,
  FiltroNumeroRange,
  FiltroSelect,
  FiltroTexto,
  FiltroSelectMultiple,
  FiltroFilialSelect,
} from ".";

// ✅ Importe o Combobox (Popover + Command) – ajuste o path conforme sua estrutura
import { Combobox } from "ui";

export function DataTableFilterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingFilters, setPendingFilters] = useState<Record<string, unknown>>(
    {}
  );
  // Campo e valor do filtro selecionado
  const [field, setField] = useState<string>("");
  const [value, setValue] = useState<any>("");

  // Operador textual (ex.: contém, igual, diferente...)
  const [textOperator, setTextOperator] = useState<string>("contains");

  // Opções dinâmicas vindas do `selectedField.opcoes`
  const [opcoes, setOpcoes] = useState<{ label: string; value: string }[]>([]);

  // Store do DataTable
  const setFilters = useDataTableStore((s) => s.setFilters);

  // Localiza no array CAMPOS_FILTRO qual configuração corresponde ao `field`
  const selectedField: CampoFiltro | undefined = CAMPOS_FILTRO.find(
    (f) => f.campo === field
  );

  // Carrega as opções se a coluna tiver `opcoes: async () => Promise<...> | array`
  useEffect(() => {
    const loadOpcoes = async () => {
      if (typeof selectedField?.opcoes === "function") {
        const result = await selectedField.opcoes();
        setOpcoes(result);
      } else if (Array.isArray(selectedField?.opcoes)) {
        setOpcoes(selectedField.opcoes);
      } else {
        setOpcoes([]);
      }
    };
    loadOpcoes();
  }, [selectedField]);

  // Quando o usuário aplica o filtro, convertemos para o formato esperado
  const handleAddFilter = () => {
    if (!field || !value) return;

    let formatted;
    if (
      selectedField?.tipo === "data-range" ||
      selectedField?.tipo === "numero-range"
    ) {
      formatted = {
        [`${field}_MIN`]: value.from ?? value.min,
        [`${field}_MAX`]: value.to ?? value.max,
      };
    } else if (selectedField?.tipo === "texto") {
      formatted = {
        [`${field}_${textOperator}`]: value,
      };
    } else {
      formatted = { [field]: value };
    }

    setPendingFilters((prev) => ({ ...prev, ...formatted }));

    // Reset campo atual
    setField("");
    setValue("");
    setTextOperator("contains");
  };
  const handleApplyAll = () => {
    setFilters(pendingFilters);
    setIsOpen(false);
    setPendingFilters({});
  };
  // Reseta os campos
  const handleReset = () => {
    setField("");
    setValue("");
    setTextOperator("contains");
  };

  // Mapeia CAMPOS_FILTRO → Combobox Items
  const comboboxItems = CAMPOS_FILTRO.map((f) => ({
    value: f.campo,
    label: f.label,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="h-9 gap-2 px-3 bg-background text-foreground hover:bg-accent"
        >
          <ZoomInIcon className="size-5" />
          <span>Filtrar</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full min-w-1/2">
        <DialogHeader>
          <DialogTitle>Adicionar Filtro</DialogTitle>
        </DialogHeader>

        <div className="w-full px-6 flex gap-2 items-center justify-between">
          {/* ✅ Combobox para seleção da Coluna */}
          <div className="w-60">
            <Combobox
              items={comboboxItems}
              onSelect={(val) => {
                setField(val ?? "");
                setValue("");
              }}
              selectedValue={field}
              placeholder="Coluna..."
            />
          </div>

          {selectedField?.tipo === "filial-select" && (
            <FiltroFilialSelect values={value} setValues={setValue} />
          )}

          {/* Se o tipo do campo for texto */}
          {selectedField?.tipo === "texto" && (
            <FiltroTexto
              value={value}
              onChange={setValue}
              comparador={textOperator}
              setComparador={setTextOperator}
            />
          )}

          {/* Se for select (ex.: Filial, Status, etc) */}
          {selectedField?.tipo === "select" && (
            <div className="w-64">
              <FiltroSelect
                value={value}
                setValue={setValue}
                options={opcoes}
              />
            </div>
          )}
          {selectedField?.tipo === "select-multiple" && (
            <FiltroSelectMultiple
              values={value ?? []}
              setValues={setValue}
              options={opcoes}
            />
          )}
          {/* Número range ex.: min e max */}
          {selectedField?.tipo === "numero-range" && (
            <FiltroNumeroRange value={value} setValue={setValue} />
          )}

          {/* Data range ex.: from e to */}
          {selectedField?.tipo === "data-range" && (
            <FiltroDataRange value={value} setValue={setValue} />
          )}

          {Object.keys(pendingFilters).length > 0 && (
            <div className="px-6 pb-2 text-sm text-muted-foreground">
              {Object.entries(pendingFilters).map(([key, val]) => (
                <div key={key}>
                  <strong>{key}</strong>: {JSON.stringify(val)}
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center px-6">
          <Button variant="outline" onClick={() => setPendingFilters({})}>
            Limpar Tudo
          </Button>
          <div className="flex gap-2">
            <Button onClick={handleAddFilter} disabled={!field || !value}>
              Adicionar
            </Button>
            <Button
              onClick={handleApplyAll}
              disabled={Object.keys(pendingFilters).length === 0}
            >
              Aplicar Filtros
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
