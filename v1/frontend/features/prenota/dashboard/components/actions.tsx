import React, {useState} from "react";
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "ui";
import {MoreHorizontal, Trash2} from "lucide-react";
import type {PreNota} from "../interfaces";
import {Editar, HistoricoRevisaoSheet} from ".";
import {toast} from "sonner";

interface ActionsProps {
    preNota: PreNota;
    onDeleteSuccess?: () => void; // Callback para atualização da lista
}

export const Actions: React.FC<ActionsProps> = ({preNota, onDeleteSuccess}) => {
    const [isHistoricoOpen, setIsHistoricoOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm("Tem certeza que deseja excluir esta pré-nota?")) return;

        setIsDeleting(true);
        try {
            const response = await fetch(
                `http://172.16.99.174:8400/rest/PreNota/DeletaPreNota?rec=${preNota.Rec}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        // Adicione headers de autenticação se necessário
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            toast.success("Pré-nota excluída com sucesso!");
            onDeleteSuccess?.(); // Notifica o componente pai para atualizar a lista
        } catch (error) {
            toast.error(`Falha na exclusão: ${error.message}`);
            console.error("Erro ao excluir pré-nota:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            {/* Menu Dropdown */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting}>
                        <span className="sr-only">Ações</span>
                        {isDeleting ? (
                            <div className="animate-spin h-4 w-4 border-2 rounded-full border-primary"/>
                        ) : (
                            <MoreHorizontal className="h-4 w-4"/>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {/* Abrir histórico/revisão */}
                    <DropdownMenuItem onClick={() => setIsHistoricoOpen(true)}>
                        Histórico | Revisão
                    </DropdownMenuItem>

                    {/* Editar pré-nota */}
                    <Editar rec={preNota.Rec}/>

                    <DropdownMenuSeparator/>

                    {/* Excluir pré-nota */}
                    <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-red-600 focus:bg-red-700"
                    >
                        <Trash2 className="mr-2 h-4 w-4"/>
                        Excluir
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* 📝 Componente de Histórico/Revisão */}
            <HistoricoRevisaoSheet
                isOpen={isHistoricoOpen}
                onOpenChange={setIsHistoricoOpen}
                preNota={preNota}
            />
        </>
    );
};