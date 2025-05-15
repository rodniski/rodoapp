// components/ConferenceDialog.tsx
import {Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from "ui";
import { ConferenceDialogProps } from "../types";

export const ConferenceDialog = ({
                                     produto,
                                     isOpen,
                                     onClose,
                                     onConfirm,
                                     isLoading,
                                     title,
                                     confirmText,
                                     variant = "default",
                                 }: ConferenceDialogProps) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
            className="max-w-[600px] max-h-[80vh] overflow-y-auto dark:bg-muted/30 bg-white/90 backdrop-blur">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <ul className="mt-2 space-y-1">
                    <li className="space-x-2">
                        <span className="text-sm text-muted-foreground">NF:</span>
                        <strong>{produto.NFLabel}</strong>
                    </li>
                    <li className="space-x-2">
                        <span className="text-sm text-muted-foreground">Produto:</span>
                        <strong>{produto.ProdutoDesc}</strong>
                    </li>
                    <li className="space-x-2">
                        <span className="text-sm text-muted-foreground">Quantidade:</span>
                        <strong>{produto.QtdEntregue}</strong>
                    </li>
                    <li className="space-x-2">
                        <span className="text-sm text-muted-foreground">Placa:</span>
                        <strong>{produto.Placa}</strong>
                    </li>
                    <li className="space-x-2">
                        <span className="text-sm text-muted-foreground">Sequência:</span>
                        <strong>{produto.Sequencia}</strong>
                    </li>
                </ul>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" onClick={onClose} disabled={isLoading}>
                    Cancelar
                </Button>
                <Button
                    variant={variant}
                    onClick={onConfirm}
                    disabled={isLoading}
                >
                    {isLoading ? "Processando..." : confirmText}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);