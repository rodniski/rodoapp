// PrioridadePopover.tsx
"use client";

import * as React from "react";
import { ChevronsUpDown, Save, ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Textarea,
} from "ui";
import { usePreNotaStore } from "@inclusao/stores";
import { PRIORIDADE_OPTIONS } from "@prenota/stores";

export function PrioridadePopover() {
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [text, setText] = React.useState("");

  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  const {
    draft: { header },
    setHeader,
  } = usePreNotaStore();

  const handleSelect = (value: string) => {
    if (value === "Alta") {
      setHeader({ prioridade: "Alta" });
      setExpanded(true);
    } else {
      setHeader({ prioridade: value, JUSTIFICATIVA: "" });
      setExpanded(false);
      setText("");
      setOpen(false);
    }
  };

  const handleConfirm = () => {
    setHeader({ JUSTIFICATIVA: text.trim() });
    setOpen(false);
    setExpanded(false);
  };

  const triggerWidth = triggerRef.current?.offsetWidth || "auto";

  return (
    <Popover open={open} onOpenChange={(o) => !expanded && setOpen(o)}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          className="w-full justify-between"
        >
          <span className="truncate">
            {header.prioridade || "Selecione a prioridade"}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0 overflow-hidden"
        align="start"
        sideOffset={4}
        style={{
          width: triggerWidth,
          maxWidth: triggerWidth,
        }}
      >
        <motion.div
          layout
          transition={{ layout: { duration: 0.25, ease: "easeInOut" } }}
          className="w-full"
        >
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
                    onClick={() => handleSelect(opt.value)}
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
                      setHeader({ prioridade: "", JUSTIFICATIVA: "" });
                    }}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Voltar
                  </Button>
                  <Button
                    className="w-1/2"
                    onClick={handleConfirm}
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
