"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Button,
  Input,
  ScrollArea,
  Progress,
} from "ui";
import { Paperclip, Trash2, Upload, Loader2, Check } from "lucide-react";
import {
  usePreNotaStore,
  useFileUploadAuxStore,
  useUploadProgressMap,
} from "@inclusao/stores";
import type { Anexo } from "@inclusao/types";

/**
 * @description Dialog para adicionar e gerenciar anexos.
 * Utiliza stores de Zustand e UI padrão do projeto RodoAPP.
 */
export function AttachmentsDialog() {
  const anexosStore = usePreNotaStore((s) => s.draft.ARQUIVOS);
  const uploadProgressMap = useUploadProgressMap();

  const { addAnexo, removeAnexo, updateAnexoDesc } =
    usePreNotaStore.getState();
  const {
    addManagedFile,
    removeManagedFile,
    updateManagedFileDescription,
  } = useFileUploadAuxStore.getState();

  const [localAnexos, setLocalAnexos] = useState<Anexo[]>([]);
  const [initialAnexos, setInitialAnexos] = useState<Anexo[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setLocalAnexos(anexosStore.map((a) => ({ ...a })));
      setInitialAnexos(anexosStore.map((a) => ({ ...a })));
    }
  }, [open, anexosStore]);

  const inputRef = useRef<HTMLInputElement>(null);

  const processAndAddFilesLocal = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      const seq = String(Date.now()) + Math.random();
      const meta: Anexo = { seq, arq: file.name, desc: "" };
      setLocalAnexos((prev) => [...prev, meta]);
    });
  };

  const handleSaveAll = () => {
    const added = localAnexos.filter(
      (la) => !initialAnexos.some((ia) => ia.seq === la.seq)
    );
    const removed = initialAnexos.filter(
      (ia) => !localAnexos.some((la) => la.seq === ia.seq)
    );
    const updated = localAnexos.filter((la) =>
      initialAnexos.some((ia) => ia.seq === la.seq)
    );

    removed.forEach((a) => {
      removeManagedFile(a.seq);
      removeAnexo(a.seq);
    });

    added.forEach((a) => {
      const seqReal = addManagedFile(new File([], a.arq));
      addAnexo({ seq: seqReal, arq: a.arq, desc: a.desc });
    });

    updated.forEach((a) => {
      updateManagedFileDescription(a.seq, a.desc);
      updateAnexoDesc(a.seq, a.desc);
    });

    setOpen(false);
  };

  const isSaveDisabled = useMemo(
    () => localAnexos.length === 0 || localAnexos.some((a) => !a.desc?.trim()),
    [localAnexos]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
      <Button variant="outline" size="sm">
          <Paperclip className="mr-2 h-4 w-4" />
          Anexos
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Anexos <span className="text-destructive">*</span></DialogTitle>
        </DialogHeader>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
          }}
          onDrop={(e) => {
            e.preventDefault();
            processAndAddFilesLocal(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          className="w-full h-36 rounded-md border-2 border-dashed border-primary/50 p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5"
          title="Arraste arquivos ou clique para selecionar"
        >
          <Upload className="w-6 h-6 mb-1 text-primary" />
          <p className="text-sm font-medium text-foreground/70 text-center">
            Arraste e solte aqui, ou clique para selecionar
          </p>
          <input
            type="file"
            multiple
            hidden
            ref={inputRef}
            onChange={(e) => {
              if (e.target.files) processAndAddFilesLocal(e.target.files);
              e.target.value = "";
            }}
          />
        </div>

        <ScrollArea className="flex-1 p-4 overflow-auto">
          {localAnexos.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground/50">
              <span>Nenhum anexo adicionado.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {localAnexos.map((anexo) => {
                const progress = uploadProgressMap.get(anexo.seq)?.progress;
                const isUploading = progress !== undefined && progress < 100;
                return (
                  <div
                    key={anexo.seq}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-card p-3 rounded-md border"
                  >
                    <div className="w-16 h-16 bg-muted/50 flex items-center justify-center rounded-md">
                      <Paperclip className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <p className="text-sm font-semibold truncate" title={anexo.arq}>
                        {anexo.arq}
                      </p>
                      <Input
                        placeholder="Descrição"
                        value={anexo.desc}
                        onChange={(e) =>
                          setLocalAnexos((prev) =>
                            prev.map((a) =>
                              a.seq === anexo.seq ? { ...a, desc: e.target.value } : a
                            )
                          )
                        }
                        disabled={isUploading}
                      />
                      {progress !== undefined && (
                        <div className="mt-1 flex items-center gap-2">
                          {isUploading ? (
                            <Loader2 className="h-3 w-3 animate-spin text-primary" />
                          ) : (
                            <Check className="h-3 w-3 text-green-600" />
                          )}
                          <Progress value={progress} className="h-1 w-full" />
                          <span className="text-xs font-mono text-muted-foreground w-10 text-right">
                            {progress}%
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setLocalAnexos((prev) =>
                          prev.filter((a) => a.seq !== anexo.seq)
                        )
                      }
                      className="w-8 h-8"
                      disabled={isUploading}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="mt-4 gap-2">
          <Button
            variant="outline"
            onClick={() => setLocalAnexos([])}
            disabled={localAnexos.length === 0}
          >
            Limpar Tudo
          </Button>
          <Button
            onClick={handleSaveAll}
            disabled={isSaveDisabled}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}