"use client";

import { AnimatedTabs,Progress } from "ui";
import { HeaderForm, Tabela, Installments } from "@inclusao/components";
import { usePreNotaStore } from "@/app/(modules)/prenota/inclusao/_lib/stores";
import { z } from "zod";
import {
  headerSchema,
  parcelaSchema,
  itemSchema,
} from "@inclusao/validation/prenota.schema";
import { usePrenotaProgress } from "@inclusao/hooks";

export default function PrenotaPage() {
  const { percent } = usePrenotaProgress()
  const headerValid = headerSchema.safeParse(
    usePreNotaStore((s) => s.draft.header)
  ).success;

  const parcelasValid = z
    .array(parcelaSchema)
    .min(1)
    .safeParse(usePreNotaStore((s) => s.draft.parcelas)).success;

  const itensValid = z
    .array(itemSchema)
    .min(1)
    .safeParse(usePreNotaStore((s) => s.draft.itens)).success;

  return (
    <div className="flex flex-col items-center justify-center overflow-hidden">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        <div className="absolute -right-36 -top-36 h-[500px] w-[500px] dark:bg-emerald-500/20 bg-emerald-500/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-36 -left-36 h-[500px] w-[500px] dark:bg-lime-500/20 bg-lime-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="z-20 h-full w-full overflow-y-auto">
        <AnimatedTabs
          tabs={[
            {
              value: "step1",
              label: "Cabeçalho",
              content: <HeaderForm />,
              valid: headerValid,
            },
            {
              value: "step2",
              label: "Parcelas",
              content: <Installments />,
              valid: parcelasValid,
            },
            {
              value: "step3",
              label: "Produtos",
              content: <Tabela />,
              valid: itensValid,
            },
          ]}
        />
      </div>
      <Progress
        value={percent}
        className="fixed bottom-0 left-0 w-screen h-2 z-50"
      />
    </div>
  );
}
