// _lib/components/stepper/header/AttachmentsCard.tsx
"use client";

import React, { useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Input,
  ScrollArea,
  Progress, // Presume que você tenha um componente Progress na sua UI lib
} from "ui"; // Seus componentes UI
import { Paperclip, Trash2, Upload, Loader2 } from "lucide-react"; // Adicionado Loader2 para progresso < 100

import {
  usePreNotaStore,
  useFileUploadAuxStore,
  useUploadProgressMap,
} from "@inclusao/stores"; // Ajuste os paths se necessário

// Importa o tipo Anexo (metadados)
import type { Anexo } from "@inclusao/types";

export function AttachmentsCard() {
  // --- Leitura de Estado ---
  // Lê os metadados do store principal para EXIBIÇÃO
  const anexosParaExibir = usePreNotaStore((s) => s.draft.anexos);
  // Lê o mapa de progresso do store auxiliar
  const uploadProgressMap = useUploadProgressMap();

  // --- Ações dos Stores ---
  // Ações do store principal (para sincronizar metadados)
  const { addAnexo, removeAnexo, updateAnexoDesc, clearAnexos } = usePreNotaStore.getState();
  // Ações do store auxiliar (para gerenciar Files e progresso)
  const {
    addManagedFile,
    removeManagedFile,
    updateManagedFileDescription,
    clearAllManagedFiles,
    // getFileData, // Poderia ser usado se precisasse ler dados do arquivo aqui
    // setUploadProgress, // Usado pela lógica de upload real (fora deste componente)
    // removeUploadProgress, // Usado pela lógica de upload real (fora deste componente)
  } = useFileUploadAuxStore.getState();

  const inputRef = useRef<HTMLInputElement>(null);

  // --- Handlers (Agora chamam ações de AMBOS os stores) ---

  const handleAddClick = () => inputRef.current?.click();

  // Processa e adiciona arquivos aos DOIS stores
  const processAndAddFiles = (filesToAdd: FileList | File[]) => {
    const filesArray = Array.from(filesToAdd);

    filesArray.forEach((file) => {
      // 1. Chama a ação do store AUXILIAR e pega o SEQ gerado
      const seq = addManagedFile(file); // Descrição inicial vazia por padrão

      // 2. Chama a ação do store PRINCIPAL para sincronizar metadados
      const newAnexoMeta: Anexo = {
        seq: seq,
        arq: file.name,
        desc: "", // Descrição inicial vazia
      };
      addAnexo(newAnexoMeta);

      // 3. Opcional: Iniciar o upload aqui? Ou apenas adicionar à lista?
      // Se o upload iniciar aqui, você chamaria uma função/hook de upload
      // que usaria setUploadProgress e removeUploadProgress do aux store.
      // Ex: uploadFile(seq, file);
    });
  };

  // Handler para o input de seleção de arquivos
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processAndAddFiles(e.target.files);
      e.target.value = ""; // Limpa o input
    }
  };

  // Handler para o drop de arquivos
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    processAndAddFiles(e.dataTransfer.files);
  };

  // Atualiza a descrição em AMBOS os stores
  const handleDescriptionChange = (seq: string, desc: string) => {
    updateManagedFileDescription(seq, desc); // Atualiza no Aux Store
    updateAnexoDesc(seq, desc); // Atualiza no PreNota Store
  };

  // Remove de AMBOS os stores
  const handleRemove = (seq: string) => {
    removeManagedFile(seq); // Remove do Aux Store (e da fila de progresso internamente)
    removeAnexo(seq); // Remove do PreNota Store
  };

  // Limpa AMBOS os stores
  const handleClearAll = () => {
    clearAllManagedFiles(); // Limpa Aux Store (arquivos e progresso)
    clearAnexos(); // Limpa PreNota Store
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Anexos</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 flex flex-col">
        {/* Zona de Drag & Drop e clique */}
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

        {/* Lista de arquivos */}
        <ScrollArea className="flex-1 p-4 overflow-auto">
          {/* Usa os anexos do PreNotaStore para renderizar */}
          {anexosParaExibir.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted">
              <span>Nenhum anexo adicionado.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Itera sobre os metadados do usePreNotaStore */}
              {anexosParaExibir.map((anexo) => {
                // Verifica o progresso no store auxiliar
                const progressItem = uploadProgressMap.get(anexo.seq);
                const currentProgress = progressItem?.progress; // Pode ser undefined se não estiver na fila
                const isUploading =
                  currentProgress !== undefined && currentProgress < 100;

                return (
                  <div
                    key={anexo.seq}
                    className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-card p-3 rounded-md border relative" // Adicionado relative para posicionar progresso/spinner
                  >
                    {/* Ícone */}
                    <div className="w-16 h-16 bg-muted/50 flex items-center justify-center rounded-md flex-shrink-0">
                      <Paperclip className="w-6 h-6 text-muted-foreground" />
                    </div>

                    {/* Nome e Descrição */}
                    <div className="flex-1 flex flex-col gap-1 w-full">
                      {" "}
                      {/* Diminuído gap */}
                      <p
                        className="text-sm font-semibold truncate"
                        title={anexo.arq}
                      >
                        {anexo.arq}
                      </p>
                      <Input
                        placeholder="Descrição"
                        value={anexo.desc || ""} // Lê do anexo (PreNotaStore)
                        onChange={(e) =>
                          handleDescriptionChange(anexo.seq, e.target.value)
                        } // Chama handler que atualiza ambos stores
                        disabled={isUploading} // Desabilita descrição durante upload (opcional)
                      />
                      {/* Barra de Progresso ou Spinner */}
                      {currentProgress !== undefined && (
                        <div className="mt-1 flex items-center gap-2">
                          {isUploading ? (
                            <Loader2 className="h-3 w-3 animate-spin text-primary" />
                          ) : (
                            <Check className="h-3 w-3 text-green-600" /> // Exemplo de ícone de concluído
                          )}
                          <Progress
                            value={currentProgress}
                            className="h-1 w-full"
                          />
                          <span className="text-xs font-mono text-muted-foreground w-10 text-right">
                            {currentProgress}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Botão Remover */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemove(anexo.seq)} // Chama handler que atualiza ambos stores
                      aria-label="Remover anexo"
                      className="w-8 h-8"
                      disabled={isUploading} // Desabilita remoção durante upload (opcional)
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

      <CardFooter className="flex justify-end">
        {/* Botão Limpar */}
        <Button
          variant="outline"
          onClick={handleClearAll}
          disabled={anexosParaExibir.length === 0}
        >
          Limpar Tudo
        </Button>
      </CardFooter>
    </Card>
  );
}
