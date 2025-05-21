// Renamed File: _lib/components/QuantityConfirmationModal.tsx (Example Name)

"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  Button,
} from "ui"; // Adjust path if needed

interface Props {
  open: boolean;
  onClose: () => void;
  // Quantities are the core reason for this modal now
  quantidadeXml: number | null | undefined;
  quantidadePedido: number | null | undefined;
  // Units are kept for display context
  unidadeXml: string | null | undefined;
  unidadePedido: string | null | undefined;
  // Callback returns the confirmed quantity
  onConfirm: (novaQtd: number) => void;
}

// Renamed Component
export const QuantityConfirmationModal: React.FC<Props> = ({
  open,
  onClose,
  unidadeXml,
  unidadePedido,
  quantidadePedido,
  quantidadeXml,
  onConfirm,
}) => {
  // Default to PO quantity for receiving, fallback to 0
  const defaultQty = quantidadePedido ?? 0;
  const [qtyStr, setQtyStr] = useState<string>(defaultQty.toString());

  // Reset input when modal opens or relevant props change
  useEffect(() => {
    if (open) {
      setQtyStr((quantidadePedido ?? 0).toString());
    }
  }, [open, quantidadePedido]);

  const handleSave = () => {
    const confirmedQty = parseFloat(qtyStr);
    if (isNaN(confirmedQty) || confirmedQty < 0) {
      toast.error("Quantidade inválida. Informe um número positivo.");
      return; // Don't close, require valid input
    }
    onConfirm(confirmedQty);
    // onClose(); // Let the caller handle closing via onConfirm typically
  };

  // Prevent closing modal by clicking outside or pressing Escape
  const preventDismiss = (event: Event) => {
    event.preventDefault();
    toast.info("Confirme a quantidade ou cancele a operação.");
  };

  // Format quantities and units for display, handling null/undefined
  const formatQtyUnit = (
    qty: number | null | undefined,
    unit: string | null | undefined
  ) => {
    return `${qty ?? "?"} ${unit || "?"}`;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        onInteractOutside={preventDismiss}
        onEscapeKeyDown={preventDismiss}
        className="sm:max-w-md"
      >
        <DialogHeader>
          {/* Updated Title */}
          <DialogTitle className="text-amber-700 dark:text-amber-500">
            ⚠️ Divergência de Quantidade
          </DialogTitle>
          {/* Updated Description */}
          <DialogDescription>
            A quantidade na NF-e (
            <strong className="text-foreground">
              {formatQtyUnit(quantidadeXml, unidadeXml)}
            </strong>
            ) é diferente da quantidade no Pedido (
            <strong className="text-foreground">
              {formatQtyUnit(quantidadePedido, unidadePedido)}
            </strong>
            ).
            <br />
            Confirme ou ajuste a quantidade que será utilizada para a entrada no
            estoque:
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-2">
          {/* Updated Label */}
          <label htmlFor="qty-confirm-input" className="text-sm font-medium">
            Quantidade para Entrada ({unidadePedido || "Unid. Pedido"}){" "}
            {/* Still use PO unit */}
          </label>
          <Input
            id="qty-confirm-input"
            type="number"
            value={qtyStr}
            onChange={(e) => setQtyStr(e.target.value)}
            min={0}
            step="any"
            className="text-lg"
            aria-label={`Quantidade para Entrada em ${
              unidadePedido || "Unidade do Pedido"
            }`}
            autoFocus
          />
          {/* Context */}
          <p className="text-xs text-muted-foreground mt-1">
            (Padrão sugerido: Quantidade do Pedido)
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Confirmar Quantidade</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
