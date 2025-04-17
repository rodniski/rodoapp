"use client";

import React, {
  useEffect,
  useRef,
  useState,
  DragEvent,
  ChangeEvent,
  MouseEvent,
} from "react";
import {
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  Input,
  ScrollArea,
  Card,
} from "ui";
import { Paperclip, Save, Upload, X } from "lucide-react";
import { useAtom, useAtomValue } from "jotai";
import { toast } from "sonner";
import {
  anexosAtom,
  arquivosAtom,
  arquivosUploadAtom,
} from "#/incluir/atoms";
import type { MenuProps } from "./rateio";
import { ShadowNoneIcon } from "@radix-ui/react-icons";

interface FileInput {
  seq: string;
  file: File | null;
  description: string;
  previewUrl?: string;
  invalid?: boolean;
}

export default function AnexosStored({ open, onOpenChange }: MenuProps) {
  const anexos = useAtomValue(anexosAtom);
  const [, setAnexos] = useAtom(anexosAtom);
  const [, setAnexosHub] = useAtom(arquivosAtom);
  const [, setAnexosUpload] = useAtom(arquivosUploadAtom);
  const [fileInputs, setFileInputs] = useState<FileInput[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      const mapped = anexos.map((a) => ({
        seq: a.seq,
        file: a.file,
        description: a.desc,
        previewUrl: a.file.type.startsWith("image/")
          ? URL.createObjectURL(a.file)
          : undefined,
        invalid: false,
      }));

      setFileInputs([
        ...mapped,
        {
          seq: nextSeq(mapped),
          file: null,
          description: "",
          previewUrl: undefined,
          invalid: false,
        },
      ]);
    }
  }, [open, anexos]);

  const nextSeq = (inputs: FileInput[] = fileInputs): string => {
    const currentSeqs = inputs.map((input) => Number(input.seq) || 0);
    const maxSeq = currentSeqs.length > 0 ? Math.max(...currentSeqs) : 0;
    return String(maxSeq + 1).padStart(3, "0");
  };

  const isDuplicate = (file: File) =>
    fileInputs.some((input) => input.file?.name === file.name);

  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => addFile(file));
    e.target.value = "";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    Array.from(e.dataTransfer.files).forEach((file) => addFile(file));
  };

  const addFile = (file: File) => {
    if (isDuplicate(file)) {
      toast.warning(`O arquivo "${file.name}" já foi adicionado.`);
      return;
    }

    const previewUrl = file.type.startsWith("image/")
      ? URL.createObjectURL(file)
      : undefined;

    setFileInputs((prev) => [
      ...prev,
      {
        seq: nextSeq(prev),
        file,
        description: "",
        previewUrl,
        invalid: false,
      },
    ]);
  };

  const handleRemoveFile = (index: number, evt?: MouseEvent) => {
    evt?.stopPropagation();
    setFileInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDescriptionChange = (index: number, description: string) => {
    setFileInputs((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, description, invalid: false } : item
      )
    );
  };

  const handleSave = () => {
    const errors: string[] = [];
  
    const validInputs = fileInputs.filter((input) => {
      if (!input.file) return false;
      if (!input.description.trim()) {
        errors.push(input.file.name);
        return false;
      }
      return true;
    });
  
    if (errors.length > 0) {
      errors.forEach((name) =>
        toast.warning(`O arquivo "${name}" está sem descrição.`)
      );
      setFileInputs((prev) =>
        prev.map((item) =>
          item.file && errors.includes(item.file.name)
            ? { ...item, invalid: true }
            : { ...item, invalid: false }
        )
      );
      return;
    }
  
    const rec = "12345";
  
    const novosParaHub = validInputs.map((input, index) => ({
      seq: String(index + 1).padStart(3, "0"),
      arq: input.file!.name,
      desc: input.description,
    }));
  
    const novosParaUpload = validInputs.map((input, index) => ({
      seq: String(index + 1).padStart(3, "0"),
      file: input.file!,
      doc: rec,
    }));
  
    const novosCompletos = validInputs.map((input, index) => ({
      seq: String(index + 1).padStart(3, "0"),
      file: input.file!,
      doc: rec,
      arq: input.file!.name,
      desc: input.description,
    }));
  
    // 🧼 Limpa os átomos e regrava com apenas os válidos
    setAnexosHub(novosParaHub);
    setAnexosUpload(novosParaUpload);
    setAnexos(novosCompletos);
  
    toast.success("Todos os anexos válidos foram salvos!");
  
    setFileInputs([
      ...validInputs.map((input, i) => ({
        ...input,
        seq: String(i + 1).padStart(3, "0"),
        previewUrl: input.previewUrl,
      })),
      {
        seq: nextSeq(),
        file: null,
        description: "",
        previewUrl: undefined,
        invalid: false,
      },
    ]);
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="min-w-[600px] p-6 flex flex-col gap-4">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Paperclip className="w-5 h-5" />
            Anexos
          </SheetTitle>
        </SheetHeader>

        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleSelectFileClick}
          className="w-full h-1/4 rounded-md border-2 border-dashed border-primary/50 p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary/5 transition-colors"
        >
          <Upload className="w-6 h-6 mb-1 text-primary" />
          <p className="text-sm font-medium text-foreground/70">
            Arraste e solte aqui, ou clique para selecionar
          </p>
          <input
            type="file"
            multiple
            accept="*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <Card className="flex-1 overflow-hidden bg-muted/40">
          <ScrollArea className="h-full overflow-auto p-4">
            {fileInputs.filter((f) => f.file).length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center h-full py-14">
                <ShadowNoneIcon className="size-24 mb-1 text-muted" />
                <span className="text-lg font-medium text-muted">
                  Nenhum anexo adicionado.
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {fileInputs.map((input, index) => {
                  if (!input.file) return null;
                  return (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-card p-3 rounded-md relative border"
                    >
                      <button
                        onClick={(evt) => handleRemoveFile(index, evt)}
                        className="absolute top-2 right-2 text-destructive hover:bg-destructive/20 p-1 rounded-full"
                        title="Remover arquivo"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="size-20 bg-muted/50 flex items-center justify-center rounded-md overflow-hidden">
                        {input.previewUrl ? (
                          <img
                            src={input.previewUrl}
                            alt={input.file?.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <Paperclip className="size-9 text-muted-foreground" />
                        )}
                      </div>

                      <div className="flex-1 w-full flex gap-3 flex-col">
                        <p className="text-sm font-semibold leading-tight">
                          {input.file?.name}
                        </p>
                        <Input
                          placeholder="Descrição"
                          value={input.description}
                          onChange={(e) =>
                            handleDescriptionChange(index, e.target.value)
                          }
                          className={`mt-1 ${
                            input.invalid
                              ? "border-red-500 ring-1 ring-red-500"
                              : ""
                          }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </Card>

        <SheetFooter className="flex justify-between items-center w-full">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button
            className="flex items-center gap-2 bg-lime-500 hover:bg-lime-600 text-white font-semibold"
            onClick={handleSave}
          >
            <Save className="w-5 h-5 flex-shrink-0" />
            <span>Salvar Anexos</span>
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}