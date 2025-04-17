"use client"

import React from "react"
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
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "ui"
import { Trash2 } from "lucide-react"
import { useAtomValue } from "jotai"
import { accessFiliaisAtom, centrosCustoAtom } from "atoms"

export interface RateioItem {
  id: string
  seq: string
  FIL: string
  filial: string
  cc: string
  valor: number
  percent: number
  REC: number
}

interface RateioTableProps {
  rateioData: RateioItem[]
  totalGeral: number
  onUpdateRateio: (id: string, updatedData: Partial<RateioItem>) => void
  onRemoveRateio: (id: string) => void
}

export function RateioTable({
  rateioData,
  totalGeral,
  onUpdateRateio,
  onRemoveRateio,
}: RateioTableProps) {
  const filiais = useAtomValue(accessFiliaisAtom)
  const centrosCusto = useAtomValue(centrosCustoAtom)

  const totalDivisao = rateioData.reduce((acc, row) => acc + row.valor, 0)
  const porcentagemDivisao = ((totalDivisao / totalGeral) * 100).toFixed(2)

  const handleValueChange = (
    id: string,
    field: "valor" | "percent",
    value: string
  ) => {
    const numericValue = parseFloat(value.replace(",", ".")) || 0

    if (field === "valor") {
      const percent = Number(((numericValue / totalGeral) * 100).toFixed(2))
      onUpdateRateio(id, { valor: numericValue, percent })
    } else {
      const valor = Number(((numericValue / 100) * totalGeral).toFixed(2))
      onUpdateRateio(id, { percent: numericValue, valor })
    }
  }

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Filial</TableHead>
            <TableHead>Centro de Custo</TableHead>
            <TableHead className="text-right">Valor (R$)</TableHead>
            <TableHead className="text-right">Porcentagem (%)</TableHead>
            <TableHead className="text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {rateioData.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="min-w-[100px]">
                <Select
                  value={row.filial}
                  onValueChange={(val) => onUpdateRateio(row.id, { filial: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filial" />
                  </SelectTrigger>
                  <SelectContent>
                    {filiais.map((f) => (
                      <SelectItem key={f.M0_CODFIL} value={f.M0_CODFIL.trim()}>
                        {f.M0_CODFIL.trim()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>

              <TableCell className="min-w-[120px]">
                <Select
                  value={row.cc}
                  onValueChange={(val) => onUpdateRateio(row.id, { cc: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Centro de custo" />
                  </SelectTrigger>
                  <SelectContent>
                    {centrosCusto.map((cc) => (
                      <SelectItem key={cc.CTT_CUSTO} value={cc.CTT_CUSTO.trim()}>
                        {cc.CTT_CUSTO.trim()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>

              <TableCell className="text-right">
                <Input
                  type="number"
                  value={row.valor.toFixed(2)}
                  step="0.01"
                  min={0}
                  onChange={(e) =>
                    handleValueChange(row.id, "valor", e.target.value)
                  }
                  placeholder="0,00"
                />
              </TableCell>
              <TableCell className="text-right">
                <Input
                  type="number"
                  value={row.percent.toFixed(2)}
                  step="0.01"
                  min={0}
                  max={100}
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

        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="text-right font-semibold">
              <div className="flex justify-between w-full">
                <div>
                  <div>
                    <span>Total Restante:</span>{" "}
                    <span>
                      {(totalGeral - totalDivisao).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                  <div className="flex gap-2 items-end">
                    <span>Total da NF:</span>{" "}
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
  )
}