// _lib/components/UnitMismatchModal.tsx
"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Input,
  Button,
} from "ui";

interface Props {
  open: boolean;
  onClose: () => void;
  unidadeXml: string;
  unidadePedido: string;
  quantidadePedido: number;
  onConfirm: (novaQtd: number) => void;
}

export const UnitMismatchModal: React.FC<Props> = ({
  open,
  onClose,
  unidadeXml,
  unidadePedido,
  quantidadePedido,
  onConfirm,
}) => {
  const [qty, setQty] = useState<number>(quantidadePedido);

  const handleSave = () => {
    onConfirm(qty);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unidades diferentes</DialogTitle>
          <DialogDescription>
            A unidade da NF-e (<strong>{unidadeXml}</strong>) é diferente da unidade do pedido
            (<strong>{unidadePedido}</strong>). A quantidade do pedido será adotada por
            padrão. Altere se precisar:
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col gap-2">
          <label className="text-sm font-medium">Quantidade a gravar</label>
          <Input
            type="number"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            min={0}
            step={0.0001}
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Confirmar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
