// PrioridadePopover.tsx
"use client";

import * as React from "react";
import { ChevronsUpDown, Save, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Popover, PopoverTrigger, PopoverContent, Button, Textarea } from "ui";
import { PRIORIDADE_OPTIONS } from "@/app/(modules)/prenota/_internal/config/constants";

interface PrioridadePopoverProps {
  prioridade?: string;
  justificativa?: string;
  onChange: (prioridade: "Alta" | "Média" | "Baixa", justificativa?: string) => void;
}

export function PrioridadePopover({
  prioridade,
  justificativa,
  onChange,
}: PrioridadePopoverProps) {
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(prioridade === "Alta");
  const [text, setText] = React.useState(justificativa || "");

  const triggerRef = React.useRef<HTMLButtonElement>(null); 
  const triggerWidth = triggerRef.current?.offsetWidth || "auto";

  React.useEffect(() => {
    setExpanded(prioridade === "Alta");
    if (prioridade !== "Alta") setText("");
  }, [prioridade]);

  const selectPrioridade = (value: "Alta" | "Média" | "Baixa") => {
    if (value === "Alta") {
      setExpanded(true);
    } else {
      setExpanded(false);
      setOpen(false);
      setText("");
      onChange(value, "");
    }
  };

  const confirmAlta = () => {
    onChange("Alta", text.trim());
    setExpanded(false);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={(o) => !expanded && setOpen(o)}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          className="w-full justify-between"
        >
          <span className="truncate">
            {prioridade || "Selecione a prioridade"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        sideOffset={4}
        style={{ width: triggerWidth, maxWidth: triggerWidth }}
        className="p-0 overflow-hidden"
      >
        <motion.div layout className="w-full">
          <AnimatePresence mode="wait" initial={false}>
            {!expanded ? (
              <motion.div
                key="options"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex flex-col p-2 gap-1"
              >
                {PRIORIDADE_OPTIONS.map((opt) => (
                  <Button
                    key={opt.value}
                    variant="ghost"
                    className="w-full justify-start text-sm h-9"
                    onClick={() =>
                      selectPrioridade(opt.value as "Alta" | "Média" | "Baixa")
                    }
                  >
                    {opt.label}
                  </Button>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="justificativa"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                className="flex flex-col p-2 gap-2"
              >
                <Textarea
                  placeholder="Descreva o motivo da prioridade alta..."
                  className="resize-none h-[72px]"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  autoFocus
                />
                <div className="flex justify-between gap-2 pr-2">
                  <Button
                    variant="ghost"
                    className="w-1/2"
                    onClick={() => {
                      setExpanded(false);
                      setText("");
                      selectPrioridade("Média"); // default fallback
                    }}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Voltar
                  </Button>
                  <Button
                    className="w-1/2"
                    onClick={confirmAlta}
                    disabled={!text.trim()}
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Salvar
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}