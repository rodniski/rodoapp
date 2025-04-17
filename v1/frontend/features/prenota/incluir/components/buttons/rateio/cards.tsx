"use client"

import { ScrollArea, Badge, Card } from "ui";
import { Trash2 } from "lucide-react";
import { ShadowNoneIcon } from "@radix-ui/react-icons";
import { RateioItem } from ".";


interface Props {
  data: RateioItem[];
  onRemove: (id: string) => void;
}

export function RateioCards({ data, onRemove }: Props) {
  return (
    <Card className="flex-1 overflow-hidden bg-muted/40">
      <ScrollArea className="h-full overflow-auto p-4">
        {data.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center h-full py-14">
            <ShadowNoneIcon className="size-24 mb-1 text-muted" />
            <span className="text-lg font-medium text-muted">
              Nenhum rateio adicionado.
            </span>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item) => (
              <div
                key={item.id}
                className="relative bg-card border rounded-md p-4 shadow-sm"
              >
                <button
                  className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                  onClick={() => onRemove(item.id)}
                  title="Remover"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <p className="text-sm text-muted-foreground mb-1">Filial</p>
                <p className="font-medium">{item.filial}</p>

                <p className="text-sm text-muted-foreground mt-3 mb-1">
                  Centro de Custo
                </p>
                <p className="font-medium">{item.cc}</p>

                <div className="flex flex-col items-start justify-start mt-4">
                  <Badge variant="outline">
                    {item.percent.toFixed(2)}%
                  </Badge>
                  <span className="font-semibold text-right text-foreground">
                    {item.valor.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
}