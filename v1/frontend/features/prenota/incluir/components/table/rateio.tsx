"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Input,
  Button,
} from "ui";
import { Trash2 } from "lucide-react";


interface RateioTableProps {
  rateioData: RateioItem[];
  totalGeral: number;
  onUpdateRateio: (id: string, updatedData: Partial<RateioItem>) => void;
  onRemoveRateio: (id: string) => void;
}

export function RateioTable({
  rateioData,
  totalGeral,
  onUpdateRateio,
  onRemoveRateio,
}: RateioTableProps) {
  const totalDivisao = rateioData.reduce((acc, row) => acc + row.valor, 0);
  const porcentagemDivisao = ((totalDivisao / totalGeral) * 100).toFixed(2);

  /**
   * Manipula mudanças nos campos de valor ou porcentagem.
   */
  const handleValueChange = (
    id: string,
    field: "valor" | "percent",
    value: string
  ) => {
    const numericValue = parseFloat(value.replace(",", ".")) || 0;

    if (field === "valor") {
      const porcentagemAtualizada = ((numericValue / totalGeral) * 100).toFixed(
        2
      );
      onUpdateRateio(id, {
        valor: numericValue,
        percent: parseFloat(porcentagemAtualizada),
      });
    } else if (field === "percent") {
      const valorAtualizado = ((numericValue / 100) * totalGeral).toFixed(2);
      onUpdateRateio(id, {
        valor: parseFloat(valorAtualizado),
        percent: numericValue,
      });
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        {/* Cabeçalho */}
        <TableHeader>
          <TableRow>
            <TableHead>Filial</TableHead>
            <TableHead>Centro de Custo</TableHead>
            <TableHead className="text-right">Valor (R$)</TableHead>
            <TableHead className="text-right">Porcentagem (%)</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>

        {/* Corpo */}
        <TableBody>
          {rateioData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.filial}</TableCell>
              <TableCell>{row.cc}</TableCell>
              <TableCell className="text-right">
                <Input
                  type="number"
                  value={row.valor}
                  onChange={(e) =>
                    handleValueChange(row.id, "valor", e.target.value)
                  }
                  placeholder="0,00"
                />
              </TableCell>
              <TableCell className="text-right">
                <Input
                  type="number"
                  value={row.percent}
                  onChange={(e) =>
                    handleValueChange(row.id, "percent", e.target.value)
                  }
                  placeholder="0,00%"
                />
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onRemoveRateio(row.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        {/* Rodapé */}
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="text-right font-semibold">
              <div className="flex justify-between w-full">
                <div>
                  <div>
                    <span>Total Restante:</span>
                    <span>
                      {(totalGeral - totalDivisao).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                  <div className="flex gap-2 items-end">
                    <span>Total da NF:</span>
                    <span>
                      {totalGeral.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex gap-2 justify-end">
                    <span>Total da divisão:</span>
                    <span>
                      {totalDivisao.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <span>Porcentagem da divisão:</span>
                    <span>{porcentagemDivisao}%</span>
                  </div>
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
