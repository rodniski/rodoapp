"use client";

import React from "react";
import { AnimatedButton } from "./AnimationButton";
import { BorrachariaItem, ItemNF } from "../../types";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { useBorrachariaStore } from "../../stores";
import { useCarregaSaida } from "@borracharia/hooks";

interface EnviarButtonProps {
  item: BorrachariaItem;
  respRet: string;
  placa: string;
  obs: string;
  respCarreg: string;
  retirado: string;
  onSuccess?: () => void;
}

export function EnviarButton({
  item,
  respRet,
  placa,
  obs,
  respCarreg,
  retirado,
  onSuccess,
}: EnviarButtonProps) {
  const selectedItems = useBorrachariaStore((state) => state.selectedItems);
  const mutation = useCarregaSaida();

  const handleSend = async () => {
    if (!respRet) return toast.error("Informe o responsável pela retirada.");
    if (!placa) return toast.error("Informe a placa do veículo.");

    const itemsToDeliver = selectedItems.filter(
      (nf: ItemNF) => nf.SaldoSelecionado > 0
    );

    if (itemsToDeliver.length === 0)
      return toast.error(
        "Informe a quantidade a entregar para pelo menos um item."
      );

    await toast.promise(
      Promise.all(
        itemsToDeliver.map((nf: ItemNF) =>
          mutation.mutateAsync({
            Filial: item.Filial ?? "",
            Origem: "S",
            Doc: item.Doc ?? "",
            Serie: item.Serie ?? "3",
            CodCliente: item.CodCliente ?? "",
            Loja: item.Loja ?? "",
            ProdutoCod: nf.ProdutoCod,
            Item: nf.Item,
            Retirado: retirado,
            RespRet: respRet,
            Placa: placa,
            Obs: obs ?? "",
            RespCarreg: respCarreg ?? "",
            Quantidade: nf.SaldoSelecionado,
          })
        )
      ),
      {
        loading: "Registrando entrega...",
        success: () => {
          onSuccess?.();
          return "Entregas registradas com sucesso!";
        },
        error: (err: any) => `Erro ao registrar entrega: ${err.message}`,
      }
    );
  };

  return (
    <AnimatedButton
      text="Enviar"
      icon={<Send />}
      variant="success"
      onClick={handleSend}
    />
  );
}
