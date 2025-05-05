"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
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

export function AttachmentsCard() {
  // store state
  const anexosStore = usePreNotaStore((s) => s.draft.ARQUIVOS);
  const uploadProgressMap = useUploadProgressMap();

  // direct store actions
  const { addAnexo, removeAnexo, clearAnexos, updateAnexoDesc } =
    usePreNotaStore.getState();
  const {
    addManagedFile,
    removeManagedFile,
    clearAllManagedFiles,
    updateManagedFileDescription,
  } = useFileUploadAuxStore.getState();

  const [localAnexos, setLocalAnexos] = useState<Anexo[]>([]);
  const [initialAnexos, setInitialAnexos] = useState<Anexo[]>([]);

  // on mount or store change reset local copies
  useEffect(() => {
    setLocalAnexos(anexosStore.map((a) => ({ ...a })));
    setInitialAnexos(anexosStore.map((a) => ({ ...a })));
  }, [anexosStore]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddClick = () => inputRef.current?.click();

  const processAndAddFilesLocal = (files: FileList | File[]) => {
    const arr = Array.from(files);
    arr.forEach((file) => {
      // create local annotation with temporary seq (e.g. timestamp)
      const seq = String(Date.now()) + Math.random();
      const meta: Anexo = { seq, arq: file.name, desc: "" };
      setLocalAnexos((prev) => [...prev, meta]);
    });
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processAndAddFilesLocal(e.target.files);
      e.target.value = "";
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    processAndAddFilesLocal(e.dataTransfer.files);
  };

  const handleDescriptionChange = (seq: string, desc: string) => {
    setLocalAnexos((prev) =>
      prev.map((a) => (a.seq === seq ? { ...a, desc } : a))
    );
  };

  const handleRemoveLocal = (seq: string) => {
    setLocalAnexos((prev) => prev.filter((a) => a.seq !== seq));
  };

  const handleClearLocal = () => {
    setLocalAnexos([]);
  };

  const isSaveDisabled = useMemo(
    () => localAnexos.length === 0 || localAnexos.some((a) => !a.desc?.trim()),
    [localAnexos]
  );

  const handleSaveAll = () => {
    // itens adicionados: presentes em local mas não em initial
    const added = localAnexos.filter(
      (la) => !initialAnexos.some((ia) => ia.seq === la.seq)
    );
    // itens removidos: presentes em initial mas não em local
    const removed = initialAnexos.filter(
      (ia) => !localAnexos.some((la) => la.seq === ia.seq)
    );
    // itens existentes para update descrição: seqs em common
    const updated = localAnexos.filter((la) =>
      initialAnexos.some((ia) => ia.seq === la.seq)
    );

    // processa removals
    removed.forEach((a) => {
      removeManagedFile(a.seq);
      removeAnexo(a.seq);
    });
    // processa additions
    added.forEach((a) => {
      const seqReal = addManagedFile(new File([], a.arq)); // ajusta caso precise Upload real
      addAnexo({ seq: seqReal, arq: a.arq, desc: a.desc });
    });
    // processa updates
    updated.forEach((a) => {
      updateManagedFileDescription(a.seq, a.desc);
      updateAnexoDesc(a.seq, a.desc);
    });

    setLocalAnexos([]);
    setInitialAnexos([]);
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>
          Anexos <span className="text-destructive">*</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 flex flex-col">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
          }}
          onDrop={handleFileDrop}
          onClick={handleAddClick}
          className="w-full h-36 rounded-md border-2 border-dashed border-primary/50 p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors"
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
            onChange={handleFilesChange}
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
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-card p-3 rounded-md border relative"
                  >
                    <div className="w-16 h-16 bg-muted/50 flex items-center justify-center rounded-md flex-shrink-0">
                      <Paperclip className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-full">
                      <p
                        className="text-sm font-semibold truncate"
                        title={anexo.arq}
                      >
                        {anexo.arq}
                      </p>
                      <Input
                        placeholder="Descrição"
                        value={anexo.desc}
                        onChange={(e) =>
                          handleDescriptionChange(anexo.seq, e.target.value)
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
                      onClick={() => handleRemoveLocal(anexo.seq)}
                      aria-label="Remover anexo"
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
      </CardContent>

      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={handleClearLocal}
          disabled={localAnexos.length === 0}
        >
          Limpar Tudo
        </Button>
        <Button
          variant="default"
          onClick={handleSaveAll}
          disabled={isSaveDisabled}
        >
          Salvar
        </Button>
      </CardFooter>
    </Card>
  );
}
