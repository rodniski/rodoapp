"use client";

import React from "react";
import { Button, HoverCard, HoverCardContent, HoverCardTrigger } from "ui";
import { Download, FileCheck2, FileX2 } from "lucide-react";
import { useAnexoDownload } from "@prenota/hooks";

interface AnexoDownloadProps {
  AnexoPath: string;
}

export const AnexoDownload: React.FC<AnexoDownloadProps> = ({ AnexoPath }) => {
  const { attachments, isLoading, handleDownload } = useAnexoDownload({ AnexoPath });

  const hasAttachments = attachments.length > 0;

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Carregando...</div>;
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer">
          {hasAttachments ? (
            <FileCheck2 className="text-lime-400" size={24} aria-label="Anexos disponíveis" />
          ) : (
            <FileX2 className="text-red-400" size={24} aria-label="Nenhum anexo disponível" />
          )}
        </span>
      </HoverCardTrigger>
      {hasAttachments && (
        <HoverCardContent className="w-80">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Anexos Disponíveis</h4>
            {attachments.map((attachment, index) => (
              <div key={index} className="flex items-center justify-between">
                <Button
                  variant="secondary"
                  onClick={() => handleDownload(attachment.Z07_PATH)}
                  className="flex justify-between items-center text-sm w-full"
                  aria-label={`Baixar ${attachment.Z07_DESC}`}
                >
                  <span className="truncate">{attachment.Z07_DESC}</span>
                  <Download className="ml-2" size={16} />
                </Button>
              </div>
            ))}
          </div>
        </HoverCardContent>
      )}
    </HoverCard>
  );
};