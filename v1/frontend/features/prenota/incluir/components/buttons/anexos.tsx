"use client";

import React, {useEffect, useRef, useState} from "react";
import {
    Button,
    DropdownMenuItem,
    Input,
    Sheet,
    SheetContent,
    SheetTrigger,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "ui";
import {Paperclip, Save, Trash2, Upload} from "lucide-react";
import {useAtom} from "jotai";
import {toast} from "sonner";
import {anexosAtom, arquivosAtom, arquivosUploadAtom,} from "#/incluir/atoms";

interface FileInput {
    seq: string;
    file: File | null;
    description: string;
}

export function AnexosStored() {
    const [fileInputs, setFileInputs] = useState<FileInput[]>([
        {seq: "001", file: null, description: ""},
    ]);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [anexosHub, setAnexosHub] = useAtom(arquivosAtom);
    const [, setAnexosAtom] = useAtom(anexosAtom);
    const [, setAnexosUpload] = useAtom(arquivosUploadAtom);
    const fileInputRefs = useRef<Array<HTMLInputElement | null>>([]);

    // Ao abrir o modal, carrega os dados do hub para popular os inputs (somente descrição)
    useEffect(() => {
        if (isSheetOpen) {
            const currentFiles = anexosHub.map((anexo, index) => ({
                seq: String(index + 1).padStart(3, "0"),
                file: null,
                description: anexo.desc,
            }));
            if (currentFiles.length === 0) {
                setFileInputs([{seq: "001", file: null, description: ""}]);
            } else {
                setFileInputs([...currentFiles, {seq: "", file: null, description: ""}]);
            }
        }
    }, [isSheetOpen, anexosHub]);

    const handleDescriptionChange = (index: number, description: string) => {
        const newFileInputs = [...fileInputs];
        newFileInputs[index].description = description;
        setFileInputs(newFileInputs);
    };

    const handleFileChange = (index: number, file: File | null) => {
        if (!file) return;
        if (isDuplicateFile(file, index)) {
            toast.warning(`O arquivo "${file.name}" já foi anexado.`);
            if (fileInputRefs.current[index]) {
                fileInputRefs.current[index]!.value = "";
            }
            return;
        }
        const newFileInputs = [...fileInputs];
        newFileInputs[index].file = file;
        setFileInputs(newFileInputs);
        // Se a última linha foi preenchida, adiciona uma nova linha vazia
        if (index === newFileInputs.length - 1) {
            addEmptyRow();
        }
    };

    const handleRemoveFile = (index: number) => {
        setFileInputs((prev) => prev.filter((_, i) => i !== index));
        setAnexosHub((prev) => prev.filter((_, i) => i !== index));
        setAnexosUpload((prev) => prev.filter((_, i) => i !== index));
    };

    const isDuplicateFile = (file: File, currentIndex: number) => {
        return fileInputs.some(
            (input, index) =>
                index !== currentIndex && input.file?.name === file.name
        );
    };

    const nextSeq = (): string => {
        const currentSeqs = fileInputs.map((input) => Number(input.seq) || 0);
        const maxSeq = currentSeqs.length > 0 ? Math.max(...currentSeqs) : 0;
        return String(maxSeq + 1).padStart(3, "0");
    };

    const addEmptyRow = () => {
        setFileInputs((prev) => [...prev, {seq: nextSeq(), file: null, description: ""}]);
    };

    const isValidInput = (input: FileInput) => {
        return input.file && input.description.trim() !== "";
    };

    const handleSave = () => {
        const validInputs = fileInputs.filter(isValidInput);
        if (validInputs.length === 0) {
            toast.warning("Nenhum arquivo válido para salvar.");
            return;
        }
        // Aqui, "rec" deve vir do processo de envio da prenota; usamos um placeholder
        const rec = "12345";

        // Dados para o Hub: sem o objeto File
        const anexosParaHub = validInputs.map((input, index) => ({
            seq: String(index + 1).padStart(3, "0"),
            arq: input.file!.name,
            desc: input.description,
        }));

        // Dados para Upload: com o objeto File e rec como doc
        const anexosParaUpload = validInputs.map((input, index) => ({
            seq: String(index + 1).padStart(3, "0"),
            file: input.file!, // garante que não é nulo
            doc: rec,
        }));

        // Dados completos para o post ao servidor
        const anexosCompleto = validInputs.map((input, index) => ({
            seq: String(index + 1).padStart(3, "0"),
            file: input.file!,
            doc: rec,
            arq: input.file!.name,
            desc: input.description,
        }));

        // Atualiza os três átomos
        setAnexosHub(anexosParaHub);
        setAnexosUpload(anexosParaUpload);
        setAnexosAtom(anexosCompleto);

        toast.success("Anexos salvos com sucesso!");
        // Atualiza a lista de inputs: mantém os já salvos (com descrição) e adiciona uma nova linha vazia
        setFileInputs([
            ...anexosParaHub.map((a) => ({seq: a.seq, file: null, description: a.desc})),
            {seq: "", file: null, description: ""},
        ]);
    };

    const triggerFileInput = (index: number) => {
        fileInputRefs.current[index]?.click();
    };

    return (
        <Sheet>
            <SheetTrigger>
                <DropdownMenuItem
                    className={"hover:font-semibold group hover:border hover:shadow border-muted-foreground justify-between h-full flex"}>
                    <Paperclip className="group-hover:text-muted-foreground w-5 h-5"/>
                    <span className={"group-hover:text-muted-foreground"}>
                    Anexos
                    </span>
                </DropdownMenuItem>
            </SheetTrigger>
            <SheetContent side="top" className="w-full">
                <h2 className="w-full text-center mb-10">Anexos</h2>
                <div className="flex flex-col gap-4 justify-center items-center">
                    <div className="w-1/2 border rounded-lg border-muted-foreground shadow">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted-foreground text-muted-foreground">
                                    <TableHead>Arquivo</TableHead>
                                    <TableHead>Descrição</TableHead>
                                    <TableHead className="text-end">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fileInputs.map((input, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <input
                                                type="file"
                                                accept="*"
                                                ref={(el) => {
                                                    fileInputRefs.current[index] = el;
                                                }}
                                                onChange={(e) =>
                                                    handleFileChange(index, e.target.files?.[0] || null)
                                                }
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full text-left font-normal"
                                                onClick={() => triggerFileInput(index)}
                                            >
                                                <Upload className="w-4 h-4 mr-2"/>
                                                {input.file ? input.file.name : "Selecionar arquivo..."}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                placeholder="Descrição"
                                                value={input.description}
                                                onChange={(e) =>
                                                    handleDescriptionChange(index, e.target.value)
                                                }
                                                className="w-full"
                                            />
                                        </TableCell>
                                        <TableCell className="flex justify-end">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleRemoveFile(index)}
                                            >
                                                <Trash2 className="w-5 h-5"/>
                                                Excluir
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <Button
                        className="flex justify-center items-center text-white font-semibold bg-lime-500 hover:bg-lime-600"
                        onClick={handleSave}
                    >
                        <Save className="w-5 h-5 flex-shrink-0"/>
                        <span>Salvar</span>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
