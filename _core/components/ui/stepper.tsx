/* ------------------------------------------------------------------------
 * AnimatedTabs com keepAlive (mantém componentes montados)
 * --------------------------------------------------------------------- */
"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, Button } from "ui";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "utils";
import { SavePreNotaButton, DebugStateSheet } from "@inclusao/components";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
  valid?: boolean;
}

interface Props {
  tabs: TabItem[];
  defaultValue?: string;
  className?: string;
}

export function AnimatedTabs({ tabs, defaultValue, className }: Props) {
  const [active, setActive] = useState(defaultValue ?? tabs[0].value);

  const idx = tabs.findIndex((t) => t.value === active);
  const first = idx === 0;
  const last = idx === tabs.length - 1;
  const stepValid = tabs[idx]?.valid !== false;
  const canForward = stepValid && !last;

  const goPrev = () => !first && setActive(tabs[idx - 1].value);
  const goNext = () => canForward && setActive(tabs[idx + 1].value);

  return (
    <Tabs
      value={active}
      onValueChange={setActive}
      className={cn("w-screen h-[calc(100vh-66px)] p-5 px-14", className)}
    >
      <div className="relative flex justify-between w-full">
        <div>
          <Link href="/prenota">
            <Button
              size="sm"
              variant="outline"
              className="font-semibold flex items-center gap-2"
            >
              <ArrowLeftIcon />
              Voltar
            </Button>
          </Link>
        </div>
        <TabsList className="fixed top-[70px] left-1/2 -translate-x-1/2 bg-muted">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              disabled={tab.valid === false && tab.value !== active}
              className={cn(
                "px-4 py-3 text-lg",
                active === tab.value && "bg-background shadow"
              )}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <DebugStateSheet />
      </div>

      {/* conteúdos com keepAlive usando hidden */}
      <div className="flex-1 relative overflow-hidden">
        {tabs.map((tab) => (
          <div
            key={tab.value}
            className={cn("h-full", active === tab.value ? "block" : "hidden")}
          >
            <AnimatePresence mode="wait">
              {active === tab.value && (
                <motion.div
                  key={tab.value}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="h-full flex flex-col"
                >
                  <div className="flex-1 overflow-y-auto">{tab.content}</div>

                  <div className="p-4 flex justify-between">
                    <Button
                      variant="secondary"
                      disabled={first}
                      onClick={goPrev}
                    >
                      Anterior
                    </Button>

                    {last ? (
                      <SavePreNotaButton disabled={!stepValid} />
                    ) : (
                      <Button onClick={goNext} disabled={!canForward}>
                        Próximo
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Tabs>
  );
}
