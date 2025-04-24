// Crie um novo arquivo, ex: @inclusao/components/DebugStateSheet.tsx
"use client";

import React, { useState, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription, // Opcional
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Button,
  Progress,
  ScrollArea,
} from "ui"; // Importe os componentes UI necessários
import { CheckCircle, Circle, Info, Code, ChevronDown, ChevronUp } from "lucide-react";
import { usePreNotaStore } from "@inclusao/stores"; // Importa o store principal
import type { PreNotaDraft } from "@inclusao/types"; // Importa o tipo do draft
import { cn } from "utils"; // Ou "lib/utils" do shadcn

// Definição mais específica para os campos que vamos monitorar
type DraftKey = keyof PreNotaDraft;
const monitoredKeys: DraftKey[] = ['header', 'itens', 'anexos', 'parcelas', 'rateios'];

interface FieldStatus {
    key: DraftKey;
    label: string;
    value: any;
    isFilled: boolean;
    isExpandable: boolean;
}

// Função para verificar se um campo está "preenchido" (lógica customizável)
const isFieldFilled = (key: DraftKey, value: any): boolean => {
    switch (key) {
        case 'header':
            // Considera preenchido se tiver fornecedor, doc e filial (exemplo)
            return !!value.FORNECEDOR && !!value.DOC && !!value.FILIAL;
        case 'itens':
        case 'anexos':
        case 'parcelas':
        case 'rateios':
            // Considera preenchido se o array não estiver vazio
            return Array.isArray(value) && value.length > 0;
        default:
            // Lógica padrão para outros tipos (adapte se necessário)
            if (Array.isArray(value)) return value.length > 0;
            if (typeof value === 'object' && value !== null) return Object.keys(value).length > 0;
            if (typeof value === 'string') return value.trim() !== '';
            return !!value; // Booleano ou número diferente de 0
    }
};

export function DebugStateSheet() {
  const [open, setOpen] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  // Lê o estado draft completo do store
  const draft = usePreNotaStore((state) => state.draft);

  // Prepara os dados para a aba de progresso
  const fieldStatuses: FieldStatus[] = useMemo(() => {
     return monitoredKeys.map(key => {
        const value = draft[key];
        const isFilled = isFieldFilled(key, value);
        const isExpandable = typeof value === 'object' && value !== null; // Objetos e arrays são expansíveis
        let label = key.charAt(0).toUpperCase() + key.slice(1); // Capitaliza
        if (key === 'header') label = 'Cabeçalho';
        if (key === 'itens') label = 'Itens da Nota';
        if (key === 'anexos') label = 'Anexos';
        if (key === 'parcelas') label = 'Parcelas';
        if (key === 'rateios') label = 'Rateios';

        return { key, label, value, isFilled, isExpandable };
     });
  }, [draft]); // Recalcula quando o draft mudar

  // Calcula progresso geral
  const filledCount = fieldStatuses.filter(f => f.isFilled).length;
  const progressPercentage = monitoredKeys.length > 0 ? (filledCount / monitoredKeys.length) * 100 : 0;

  // Função para alternar expansão
  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  // Ícone de status
  const getStatusIcon = (isFilled: boolean) =>
    isFilled ? (
      <CheckCircle className="text-green-500 dark:text-green-400 w-5 h-5 flex-shrink-0" />
    ) : (
      <Circle className="text-muted-foreground w-5 h-5 flex-shrink-0" />
    );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* Botão que abre o Sheet */}
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Info className="w-4 h-4 mr-2" />
          Ver Progresso
        </Button>
      </SheetTrigger>

      {/* Conteúdo do Sheet */}
      <SheetContent className="w-[80vw] flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle>Estado Atual da Pré-Nota (Draft)</SheetTitle>
          <SheetDescription>
            Visualize os dados preenchidos e o JSON correspondente.
          </SheetDescription>
        </SheetHeader>

        <Tabs defaultValue="progress" className="w-full flex-1 flex flex-col overflow-hidden">
          {/* Abas */}
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="progress">Estrutura / Progresso</TabsTrigger>
            <TabsTrigger value="json">JSON Completo</TabsTrigger>
            {/* <TabsTrigger value="anexos">Debug Anexos</TabsTrigger> // Aba opcional */}
          </TabsList>

          {/* Conteúdo Aba Progresso */}
          <TabsContent value="progress" className="mt-4 flex-1 flex flex-col gap-4 overflow-hidden">
             <div>
                <h4 className="text-sm font-medium mb-2 text-center">Progresso Geral (Seções Preenchidas)</h4>
                <Progress value={progressPercentage} />
                <p className="text-xs text-muted-foreground mt-1 text-center">
                    {filledCount} de {monitoredKeys.length} seções preenchidas ({Math.round(progressPercentage)}%)
                </p>
            </div>
             <ScrollArea className="flex-1 pr-3">
                <div className="space-y-2 ">
                    {fieldStatuses.map((field) => (
                        <div
                            key={field.key}
                            className={cn(
                                "flex items-start gap-2 p-2 rounded-md border",
                                field.isFilled ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800/30" : "bg-muted/50"
                            )}
                        >
                            <div className="mt-1">{getStatusIcon(field.isFilled)}</div>
                            <div className="flex-1 overflow-hidden"> {/* Prevents overflow */}
                                <div
                                    className={cn("flex items-center justify-between", field.isExpandable && "cursor-pointer hover:bg-muted/80 rounded p-1 -m-1 mb-1")}
                                    onClick={field.isExpandable ? () => toggleExpand(field.key) : undefined}
                                >
                                    <span className="text-sm font-medium">{field.label}</span>
                                    {field.isExpandable && (
                                        expandedKeys.includes(field.key) ? (
                                            <ChevronUp className="w-4 h-4 flex-shrink-0" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 flex-shrink-0" />
                                        )
                                    )}
                                </div>
                                {/* Detalhes (JSON para objetos/arrays, valor direto para outros) */}
                                <div className={cn("mt-1 text-xs text-muted-foreground", !expandedKeys.includes(field.key) && !field.isExpandable && "break-words")}>
                                    {field.isExpandable ? (
                                        expandedKeys.includes(field.key) ? (
                                            <pre className="text-xs bg-background p-2 rounded whitespace-pre-wrap border max-h-60 overflow-auto">
                                                {JSON.stringify(field.value, null, 2)}
                                            </pre>
                                        ) : (
                                            <span>{Array.isArray(field.value) ? `(${field.value.length} itens)` : '(Detalhes...) '}</span>
                                        )
                                    ): (
                                        <span>{field.value?.toString() || <span className="italic">Vazio</span>}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
          </TabsContent>

          {/* Conteúdo Aba JSON */}
          <TabsContent value="json" className="mt-4 flex-1 overflow-hidden">
             <div className="flex items-center justify-between mb-2">
                 <h4 className="text-sm font-medium">JSON Completo (`draft`)</h4>
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