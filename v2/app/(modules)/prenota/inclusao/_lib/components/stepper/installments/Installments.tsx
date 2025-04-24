"use client";

import React from "react";
// Ajuste os imports dos seus componentes e UI lib se necessário
import { AttachmentsCard } from "./AttachmentsCard";
import { RateioCard } from ".";
import { Card, Tabs, TabsList, TabsTrigger, TabsContent, Separator } from "ui";

/**
 * Componente de layout para a seção de Anexos, Rateio e Cond. Pagamento.
 * Utiliza CSS Grid para layout responsivo:
 * - Default (mobile): 1 coluna.
 * - lg+ (>=1024px): 3 colunas / 2 linhas implícitas.
 */
export function Installments() {
  return (
    // Grid principal: 1 coluna default, 3 colunas em lg+, 2 linhas em lg+
    <div className="flex w-full h-full justify-center items-top py-10">
    <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 w-full gap-4 p-1">

      {/* Anexos: Coluna 1 / Span 2 Linhas (lg+) */}
      <div className="lg:col-span-1 lg:row-span-2 min-h-[300px]">
        {/* AttachmentsCard deve ter h-full para preencher */}
        <AttachmentsCard />
      </div>

      {/* Card com Abas: Coluna 2-3 / Span 2 Linhas (lg+) */}
      <Card className="lg:col-start-2 lg:col-span-2 lg:row-span-2 flex flex-col min-h-[300px] py-0">
        {/* Tabs ocupam todo o espaço do Card */}
        <Tabs defaultValue="rateio" className="flex flex-col flex-1">
          <div className="bg-input/20 flex w-full justify-center items-center shadow">
          <TabsList className="my-4 self-center bg-card shadow border"> {/* Alinha abas à esquerda */}
            <TabsTrigger value="rateio" className=" text-lg">Rateio</TabsTrigger>
            <TabsTrigger value="payment-cond" className=" text-lg">Condicão de Pagamento</TabsTrigger>
          </TabsList>
          </div>
          <TabsContent value="rateio" className="flex-1 p-4 overflow-auto">
            <RateioCard />
          </TabsContent>
          <TabsContent value="payment-cond" className="flex-1 p-4">
            {/* Conteúdo da Condição de Pagamento */}
            <div className="text-center text-muted-foreground p-10">
                (Conteúdo da Condição de Pagamento)
            </div>
          </TabsContent>
        </Tabs>
      </Card>
      </div>
    </div>
  );
}