// HubJsonTab.tsx
"use client";

import React from "react";
import { Code } from "lucide-react";

interface HubJsonTabProps {
    hubData: any;
}

export function HubJsonTab({ hubData }: HubJsonTabProps) {
    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium">Dados do Hub em JSON</h4>
                <Code className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="h-[calc(100vh-300px)] overflow-y-auto">
        <pre className="text-xs bg-muted p-4 rounded whitespace-pre-wrap">
          {JSON.stringify(hubData, null, 2)}
        </pre>
            </div>
        </div>
    );
}
