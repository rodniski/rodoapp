"use client";

import React from "react";
// Ajuste os imports dos seus componentes e UI lib se necessário
import { AttachmentsCard } from "./AttachmentsCard";
import { RateioCard } from ".";
import { Card } from "ui";

/**
 * Componente de layout para a seção de Anexos, Rateio e Cond. Pagamento.
 * Utiliza CSS Grid para layout responsivo:
 * - Default (mobile): 1 coluna.
 * - lg+ (>=1024px): 3 colunas / 2 linhas implícitas.
 */
export function Installments() {
  return (
    // Grid principal: 1 coluna default, 3 colunas em lg+, 2 linhas em lg+
    <div className="flex w-full h-full justify-center items-top pt-[70px]">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 w-full gap-4 p-1">
        {/* Anexos: Coluna 1 / Span 2 Linhas (lg+) */}
        <div className="lg:col-span-1 lg:row-span-2 min-h-[300px]">
          {/* AttachmentsCard deve ter h-full para preencher */}
          <AttachmentsCard />
        </div>

        {/* Card com Abas: Coluna 2-3 / Span 2 Linhas (lg+) */}
        <Card className="lg:col-start-2 lg:col-span-2 lg:row-span-2 flex flex-col min-h-[300px] py-0">
          {/* Tabs ocupam todo o espaço do Card */}

          <RateioCard />
        </Card>
      </div>
    </div>
  );
}
