// HubProgressTab.tsx
"use client";

import React from "react";
import { Progress } from "ui";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "lib";

interface Field {
    key: string;
    label: string;
    value: any;
}

interface HubProgressTabProps {
    fields: Field[];
    progressPercentage: number;
    expandedFields: string[];
    toggleExpand: (key: string) => void;
    getStatusIcon: (field: Field) => React.ReactNode;
}

export  function HubProgressTab({
                                           fields,
                                           progressPercentage,
                                           expandedFields,
                                           toggleExpand,
                                           getStatusIcon,
                                       }: HubProgressTabProps) {
    return (
        <>
            <div>
                <h4 className="text-sm font-medium mb-2">Progresso Geral</h4>
                <Progress value={progressPercentage} />
                <p className="text-xs text-muted-foreground mt-1">
                    {Math.round(progressPercentage)}% concluído
                </p>
            </div>
            <div className="space-y-2 mt-4 h-[calc(100vh-300px)] overflow-y-auto">
                {fields.map((field) => {
                    const filled = field.value && (Array.isArray(field.value) ? field.value.length > 0 : true);
                    return (
                        <div
                            key={field.key}
                            className={cn(
                                "flex items-start gap-2 p-2 rounded-md border",
                                filled ? "bg-green-50 border-green-500 dark:bg-green-900/20" : "bg-muted border-border"
                            )}
                        >
                            <div className="mt-1">{getStatusIcon(field)}</div>
                            <div className="flex-1">
                                <span className="text-sm font-medium">{field.label}</span>
                                {Array.isArray(field.value) ? (
                                    <div className="w-full">
                                        <div
                                            className="flex items-center justify-between cursor-pointer hover:bg-muted/50 rounded p-1"
                                            onClick={() => toggleExpand(field.key)}
                                        >
                      <span className="text-sm">
                        {field.value.length} {field.key.toLowerCase()}
                      </span>
                                            {expandedFields.includes(field.key) ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </div>
                                        {expandedFields.includes(field.key) && (
                                            <div className="mt-2 space-y-2 pl-4 border-l-2">
                                                {field.value.map((item: any, index: number) => (
                                                    <pre
                                                        key={index}
                                                        className="text-xs bg-muted p-2 rounded whitespace-pre-wrap"
                                                    >
                            {JSON.stringify(item, null, 2)}
                          </pre>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-xs text-muted-foreground break-all">
                                        {typeof field.value === "object" && field.value !== null
                                            ? JSON.stringify(field.value)
                                            : field.value || "N/A"}
                                    </p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
