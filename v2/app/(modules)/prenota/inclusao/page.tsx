"use client";

import { AnimatedTabs } from "@/_core/components";
import { HeaderForm, ProductList, Installments } from "@inclusao/components";
import { DebugStateSheet } from "./_lib/components/DebugStateSheet";

export default function PrenotaPage() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute -right-36 -top-36 h-[500px] w-[500px] dark:bg-emerald-500/20 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-36 -left-36 h-[500px] w-[500px] dark:bg-lime-500/20 bg-lime-500/10 rounded-full blur-[100px]" />
      </div>


      <div className="z-20">
        <AnimatedTabs
          tabs={[
            { value: "step1", label: "Cabeçalho", content: <HeaderForm /> },
            {
              value: "step2",
              label: "Dados Importantes",
              content: <Installments />,
            },
            { value: "step3", label: "Produtos", content: <ProductList /> },
          ]}
        />
      </div>
    </div>
  );
}
