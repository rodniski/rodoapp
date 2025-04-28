// @inclusao/components/DebugStateSheet.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
  Progress,
  ScrollArea,
} from "ui";
import {
  CheckCircle,
  Circle,
  Info,
  Code,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { usePreNotaStore, usePreNotaAuxStore } from "@inclusao/stores";
import type { PreNotaDraft } from "@inclusao/types";
import { cn } from "utils";

/* ---------- progresso draft ---------- */
type DraftKey = keyof PreNotaDraft;
const monitoredKeys: DraftKey[] = [
  "header",
  "itens",
  "anexos",
  "parcelas",
  "rateios",
];
interface FieldStatus {
  key: DraftKey;
  label: string;
  value: any;
  isFilled: boolean;
  isExpandable: boolean;
}
const isFilled = (k: DraftKey, v: unknown) => {
  if (k === "header") return !!(v as any).FORNECEDOR;
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === "object" && v) return Object.keys(v).length > 0;
  if (typeof v === "string") return v.trim() !== "";
  return !!v;
};

export function DebugStateSheet() {
  const [open, setOpen] = useState(false);
  const [expanded, setExp] = useState<string[]>([]);

  const draft = usePreNotaStore((s) => s.draft);
  const auxSlices = usePreNotaAuxStore();
  const auxList = Object.entries(auxSlices) as [string, unknown][];

  /* progresso */
  const statuses: FieldStatus[] = useMemo(() => {
    const labels: Record<DraftKey, string> = {
      header: "Cabeçalho",
      itens: "Itens",
      anexos: "Anexos",
      parcelas: "Parcelas",
      rateios: "Rateios",
    };
    return monitoredKeys.map((k) => {
      const val = draft[k];
      return {
        key: k,
        label: labels[k],
        value: val,
        isFilled: isFilled(k, val),
        isExpandable: typeof val === "object" && val !== null,
      };
    });
  }, [draft]);

  const pct =
    (statuses.filter((s) => s.isFilled).length / monitoredKeys.length) * 100;

  const toggle = (k: string) =>
    setExp((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));

  const Icon = ({ ok }: { ok: boolean }) =>
    ok ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <Circle className="w-5 h-5 text-muted-foreground" />
    );

  /* JSX */
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Info className="w-4 h-4 mr-2" />
          Progresso
        </Button>
      </SheetTrigger>

      <SheetContent className="w-[85vw] flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle>Estado da Pré-Nota</SheetTitle>
          <SheetDescription>
            Preenchimento do draft e stores auxiliares.
          </SheetDescription>
        </SheetHeader>

        <Tabs
          defaultValue="progress"
          className="w-full flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="progress">Estrutura</TabsTrigger>
            <TabsTrigger value="aux">Auxiliares</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>

          {/* Estrutura */}
          <TabsContent
            value="progress"
            className="mt-4 flex-1 flex flex-col gap-4 overflow-hidden"
          >
            <div>
              <h4 className="text-sm font-medium text-center mb-2">
                Progresso Geral
              </h4>
              <Progress value={pct} />
              <p className="text-xs text-center text-muted-foreground mt-1">
                {Math.round(pct)}% – {statuses.filter((s) => s.isFilled).length}
                /{monitoredKeys.length}
              </p>
            </div>
            <ScrollArea className="flex-1 pr-3">
              <div className="space-y-2">
                {statuses.map((f) => (
                  <div
                    key={f.key}
                    className={cn(
                      "flex items-start gap-2 p-2 rounded-md border",
                      f.isFilled
                        ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30"
                        : "bg-muted/50"
                    )}
                  >
                    <div className="mt-1">
                      <Icon ok={f.isFilled} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div
                        className={cn(
                          "flex items-center justify-between",
                          f.isExpandable &&
                            "cursor-pointer hover:bg-muted/80 rounded p-1 -m-1 mb-1"
                        )}
                        onClick={
                          f.isExpandable ? () => toggle(f.key) : undefined
                        }
                      >
                        <span className="text-sm font-medium">{f.label}</span>
                        {f.isExpandable &&
                          (expanded.includes(f.key) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          ))}
                      </div>
                      <div
                        className={cn(
                          "mt-1 text-xs text-muted-foreground",
                          f.isExpandable &&
                            !expanded.includes(f.key) &&
                            "truncate"
                        )}
                      >
                        {f.isExpandable ? (
                          expanded.includes(f.key) ? (
                            <pre className="text-xs bg-background p-2 border rounded whitespace-pre-wrap max-h-56 overflow-auto">
                              {JSON.stringify(f.value, null, 2)}
                            </pre>
                          ) : Array.isArray(f.value) ? (
                            `(${f.value.length} itens)`
                          ) : (
                            "(detalhes…)"
                          )
                        ) : (
                          <span>{String(f.value) || <i>Vazio</i>}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Auxiliares */}
          <TabsContent value="aux" className="mt-4 flex-1 overflow-hidden">
            <ScrollArea className="h-full pr-3">
              <div className="space-y-2">
                {auxList.map(([sk, sv]) => {
                  const k = `aux-${sk}`;
                  const expandable = typeof sv === "object" && sv !== null;
                  const exp = expanded.includes(k);
                  return (
                    <div
                      key={sk}
                      className="flex items-start gap-2 p-2 rounded-md border bg-muted/40"
                    >
                      <div className="mt-1">
                        <Circle className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <div
                          className={cn(
                            "flex items-center justify-between",
                            expandable &&
                              "cursor-pointer hover:bg-muted/80 rounded p-1 -m-1 mb-1"
                          )}
                          onClick={expandable ? () => toggle(k) : undefined}
                        >
                          <span className="text-sm font-medium capitalize">
                            {sk}
                          </span>
                          {expandable &&
                            (exp ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            ))}
                        </div>
                        <div
                          className={cn(
                            "mt-1 text-xs text-muted-foreground",
                            expandable && !exp && "truncate"
                          )}
                        >
                          {expandable ? (
                            exp ? (
                              <pre className="text-xs bg-background p-2 border rounded whitespace-pre-wrap max-h-56 overflow-auto">
                                {JSON.stringify(sv, null, 2)}
                              </pre>
                            ) : Array.isArray(sv) ? (
                              `(${sv.length} itens)`
                            ) : (
                              "(detalhes…)"
                            )
                          ) : (
                            <span>{String(sv) || <i>Vazio</i>}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* JSON bruto */}
          <TabsContent value="json" className="mt-4 flex-1 overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium">Draft (raw JSON)</h4>
              <Code className="w-4 h-4 text-muted-foreground" />
            </div>
            <ScrollArea className="h-full border rounded">
              <pre className="text-xs p-4 whitespace-pre-wrap">
                {JSON.stringify(draft, null, 2)}
              </pre>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
