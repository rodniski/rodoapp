"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  Button,
  Input,
  Label,
  Textarea,
  Combobox,
} from "ui";
import {
  usePedidoCompraStore,
  usePostPedidoCompra,
  PedidoCompraItem,
} from "..";
import { toast } from "sonner";
import { useFilialOptions } from "utils";
import { FornecedorDialog } from "./fornecedor";
import { useAuxStore } from "@login/stores/aux-store";
import { TIPOS_NF_OPTIONS } from "@/app/(modules)/prenota/_lib/config/constants";

export function IncludePedidoCard() {
  const filialOptions = useFilialOptions();
  const condicoes = useAuxStore((s) => s.condicoes) || [];
  const condFinOptions = condicoes.map((c) => ({
    value: c.E4_CODIGO,
    label: c.E4_CODIGO + " - " + c.E4_DESCRI,
  }));

  const draft = usePedidoCompraStore((s) => s.draft);
  const setDraft = usePedidoCompraStore((s) => s.setDraft);
  const clearDraft = usePedidoCompraStore((s) => s.clearDraft);

  const { createPedido, isLoading } = usePostPedidoCompra();

  const [itemsJson, setItemsJson] = useState<string>(
    JSON.stringify(draft.ITENS, null, 2)
  );

  const handleSubmit = () => {
    let items: PedidoCompraItem[];
    try {
      items = JSON.parse(itemsJson);
      if (!Array.isArray(items)) throw new Error();
    } catch {
      toast.error("Itens inválidos: insira um array JSON de itens");
      return;
    }

    setDraft({ ITENS: items });

    createPedido(
      { ...draft, ITENS: items },
      {
        onSuccess: (data) => {
          if (data.Sucesso) {
            toast.success("Pedido de compra criado com sucesso");
            clearDraft();
          } else {
            toast.error(data.Mensagem || "Falha ao criar pedido");
          }
        },
        onError: (err) => {
          toast.error(err.message || "Falha ao criar pedido");
        },
      }
    );
  };

  const handleCancel = () => {
    clearDraft();
  };

  return (
    <Card className="w-full max-w-3xl mx-auto z-30">
      <CardHeader>
        <CardTitle>Novo Pedido de Compra</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="filial">Filial</Label>
          <Combobox
            items={filialOptions}
            selectedValue={draft.FILIAL || undefined}
            onSelect={(v) => setDraft({ FILIAL: v })}
            placeholder="Selecione a filial"
          />
        </div>
        <div>
          <Label htmlFor="filialEntrega">Filial Entrega</Label>
          <Combobox
            items={filialOptions}
            selectedValue={draft.FILENTREGA || undefined}
            onSelect={(v) => setDraft({ FILENTREGA: v })}
            placeholder="Selecione filial de entrega"
          />
        </div>
        <div>
          <Label htmlFor="fornecedor">Fornecedor</Label>
          <FornecedorDialog />
        </div>
        <div>
          <Label htmlFor="loja">Loja</Label>
          <Input
            id="loja"
            value={draft.LOJA}
            onChange={(e) => setDraft({ LOJA: e.target.value })}
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="contato">Contato</Label>
          <Input
            id="contato"
            value={draft.CONTATO}
            onChange={(e) => setDraft({ CONTATO: e.target.value })}
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="obs">Observações</Label>
          <Textarea
            id="obs"
            value={draft.OBS}
            onChange={(e) => setDraft({ OBS: e.target.value })}
            rows={3}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label htmlFor="condfin">Condição Financeira</Label>
          <Combobox
            items={condFinOptions}
            selectedValue={draft.CONDFIN || undefined}
            onSelect={(v) => setDraft({ CONDFIN: v })}
            placeholder="Selecione condição"
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <Label htmlFor="tipoped">Tipo de Pedido</Label>
          <Combobox
            items={TIPOS_NF_OPTIONS}
            selectedValue={draft.TIPOPED || undefined}
            onSelect={(v) => setDraft({ TIPOPED: v })}
            placeholder="Selecione tipo de pedido"
          />
        </div>
        <div className="col-span-2">
          <Label htmlFor="itens">Itens (JSON)</Label>
          <Textarea
            id="itens"
            value={itemsJson}
            onChange={(e) => setItemsJson(e.target.value)}
            rows={6}
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button variant="secondary" onClick={handleCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Pedido"}
        </Button>
      </CardFooter>
    </Card>
  );
}
