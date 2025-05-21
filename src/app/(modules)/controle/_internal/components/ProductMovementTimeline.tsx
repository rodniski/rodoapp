import type React from "react";
import { Truck, CheckCircle, ContactRound } from "lucide-react";
import { ScrollArea, ScrollBar } from "ui";

interface ProductMovementTimelineProps {
  movimentacoes: any[];
}

export const ProductMovementTimeline: React.FC<
  ProductMovementTimelineProps
> = ({ movimentacoes }) => {
  return (
    <ScrollArea className="w-full relative">
      <div className="flex pb-12 gap-6 relative pt-8">
        {/* Timeline line */}

        {movimentacoes.map((movimento, index) => (
          <div
            key={movimento.Sequencia}
            className="relative shrink-0 w-[250px] first:ml-3 last:mr-3"
          >
            {/* Timeline dot */}
            <div className="absolute top-0 left-0 right-0 h-1 w-[109%] bg-gray-300 z-10"></div>
            <div className="absolute -top-1.5 left-1/2 w-[15px] h-[15px] bg-primary rounded-full transform -translate-x-1/2 z-20"></div>

            {/* Card */}
            <div className="border rounded-lg p-4 flex flex-col space-y-2 mt-4 bg-background shadow-md">
              <div className="flex items-center space-x-2">
                <ContactRound className="w-5 h-5 text-amber-500" />
                <span className="font-medium">Motorista</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Retirado por: {movimento.Motorista.RespRet}</p>
                <p>Placa: {movimento.Motorista.Placa}</p>
                <p>Observações: {movimento.Motorista.Obs}</p>
              </div>
              <div className="border-t my-2"></div>
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Carregamento</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Data: {movimento.Carregamento.DataCarreg}</p>
                <p>Hora: {movimento.Carregamento.HoraCarreg}</p>
                <p>Responsável: {movimento.Carregamento.RespCarreg}</p>
              </div>
              <div className="border-t my-2"></div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">Conferência</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Data: {movimento.Conferencia.DataConf}</p>
                <p>Hora: {movimento.Conferencia.HoraConf}</p>
                <p>Responsável: {movimento.Conferencia.RespConf}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
