// _lib/components/PrioridadePopover.tsx
"use client";

import * as React from "react";
import { ChevronsUpDown, Save, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Textarea,
} from "ui";
import { PRIORIDADE_OPTIONS } from "@prenota/stores";
import { useFormContext, Controller } from "react-hook-form";
import type { HeaderSchemaParsed } from "@inclusao/validation/prenota.schema";

export function PrioridadePopover() {
  const { control, formState: { errors } } = useFormContext<HeaderSchemaParsed>();
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const triggerWidth = triggerRef.current?.offsetWidth || "auto";

  return (
    <Controller
      name="prioridade"
      control={control}
      render={({ field: { value: prioridade, onChange } }) => (
        <Controller
          name="JUSTIFICATIVA"
          control={control}
          render={({ field: { value: justificativa, onChange: onChangeJust } }) => {
            const [open, setOpen] = React.useState(false);
            const [expanded, setExpanded] = React.useState(prioridade === "Alta");
            const [text, setText] = React.useState(justificativa);

            // Se trocar de prioridade pra outra que não "Alta", limpa justificativa
            React.useEffect(() => {
              if (prioridade !== "Alta") {
                onChangeJust("");
                setText("");
                setExpanded(false);
                setOpen(false);
              }
            }, [prioridade, onChangeJust]);

            const selectPrioridade = (v: string) => {
              onChange(v as any);
              if (v === "Alta") {
                setExpanded(true);
              } else {
                setOpen(false);
              }
            };

            const confirmAlta = () => {
              onChangeJust(text.trim());
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
                    onClick={() => setOpen(true)}
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
                      {/* Se não expandido, mostra as opções */}
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
                              onClick={() => selectPrioridade(opt.value)}
                            >
                              {opt.label}
                            </Button>
                          ))}
                        </motion.div>
                      ) : (
                        /* Se "Alta", mostra textarea p/ justificativa */
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
                                selectPrioridade("");
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
                          {errors.JUSTIFICATIVA && (
                            <p className="text-xs text-destructive">
                              {errors.JUSTIFICATIVA.message}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </PopoverContent>

                {/* Mensagem de erro abaixo do trigger */}
                {(errors.prioridade || errors.JUSTIFICATIVA) && (
                  <div className="mt-1">
                    {errors.prioridade && (
                      <p className="text-xs text-destructive">
                        {errors.prioridade.message}
                      </p>
                    )}
                    {errors.JUSTIFICATIVA && (
                      <p className="text-xs text-destructive">
                        {errors.JUSTIFICATIVA.message}
                      </p>
                    )}
                  </div>
                )}
              </Popover>
            );
          }}
        />
      )}
    />
  );
}
