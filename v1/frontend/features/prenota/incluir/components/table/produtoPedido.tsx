"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "ui";

interface Produto {
  C7_ITEM: string;
  C7_PRODUTO: string;
  B1_DESC: string;
  C7_QUANT: number;
  C7_PRECO: number;
  C7_TOTAL: number;
}

export function ProdutosTable({ produtos }: { produtos: Produto[] }) {
  const formatNumber = (value: number) =>
    value.toLocaleString("pt-BR", { minimumFractionDigits: 2 });

  return (
    <Table>
      <TableCaption>Produtos do Pedido Selecionado</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Item</TableHead>
          <TableHead>Produto</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Quantidade</TableHead>
          <TableHead>Preço Unitário (R$)</TableHead>
          <TableHead>Total (R$)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {produtos.length > 0 ? (
          produtos.map((produto) => (
            <TableRow key={produto.C7_ITEM}>
              <TableCell className="font-medium">{produto.C7_ITEM || "—"}</TableCell>
              <TableCell>{produto.C7_PRODUTO || "—"}</TableCell>
              <TableCell>{produto.B1_DESC || "—"}</TableCell>
              <TableCell>{produto.C7_QUANT || 0}</TableCell>
              <TableCell>{formatNumber(produto.C7_PRECO)}</TableCell>
              <TableCell>{formatNumber(produto.C7_TOTAL)}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              Nenhum produto encontrado.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
