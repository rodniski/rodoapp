// HubAnexosTab.tsx
"use client";

import React from "react";
import {Button} from "ui";

interface HubAnexosTabProps {
    anexosHub: any;
    anexosUpload: any;
    anexosCompleto: any;
}

export function HubAnexosTab({
                                         anexosHub,
                                         anexosUpload,
                                         anexosCompleto,
                                     }: HubAnexosTabProps) {
    const handleDownload = (file: File) => {
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-medium">Anexos - Dados enviados com a Pré-nota</h4>
            <pre className="text-xs bg-muted p-4 rounded whitespace-pre-wrap">
        {JSON.stringify(anexosHub, null, 2)}
      </pre>

            <h4 className="text-sm font-medium">Anexos - Dados para Upload</h4>
            <pre className="text-xs bg-muted p-4 rounded whitespace-pre-wrap">
        {JSON.stringify(anexosUpload, null, 2)}
      </pre>

            <h4 className="text-sm font-medium">Anexos - Dados Completos (Servidor)</h4>
            <pre className="text-xs bg-muted p-4 rounded whitespace-pre-wrap">
        {JSON.stringify(anexosCompleto, null, 2)}
      </pre>

            <div>
                <h4 className="text-sm font-medium">Download de Arquivos</h4>
                {anexosUpload.map((anexo: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                        <span className="text-sm">{anexo.file.name}</span>
                        <Button variant="outline" size="sm" onClick={() => handleDownload(anexo.file)}>
                            Download
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
