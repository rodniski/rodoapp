"use client";

import { AnimatedTabs } from "ui";
import {
  HeaderForm,
  Tabela,
  Installments,
  FormProgressHoverCard,
} from "@inclusao/components";
import { usePreNotaStore } from "@/app/(modules)/prenota/inclusao/_lib/stores";
import { z } from "zod";
import {
  headerSchema,
  parcelaSchema,
  anexoSchema,
  itemSchema,
  rateioSchema,
} from "@inclusao/validation/prenota.schema";
import { Background } from "comp";

export default function PrenotaPage() {
  const draft = usePreNotaStore((s) => s.draft);

  // Validação do cabeçalho
  const headerValid = headerSchema.safeParse(draft.header).success;

  // Validação da etapa 2: exige ao menos 1 parcela, 1 anexo e 1 rateio
  const step2Valid = z
    .object({
      parcelas: z.array(parcelaSchema).min(1, "Adicione ao menos 1 parcela"),
      anexos: z.array(anexoSchema).min(1, "Adicione ao menos 1 anexo"),
      rateio: z.array(rateioSchema).min(1, "Adicione ao menos 1 rateio"),
    })
    .safeParse({
      parcelas: draft.PAGAMENTOS,
      anexos: draft.ARQUIVOS,
      rateio: draft.RATEIOS, // Corrigido
    }).success;

  // Validação da etapa 3: exige ao menos 1 item
  const itemsValid = z
    .array(itemSchema)
    .min(1, "Adicione ao menos 1 item")
    .safeParse(draft.itens).success;

  console.log({
    parcelas: draft.PAGAMENTOS,
    anexos: draft.ARQUIVOS,
    rateio: draft.RATEIOS,
    step2Valid,
  });

  return (
    <div className="relative flex flex-col items-center justify-center h-full overflow-hidden">
      <Background />
      <div className="z-20 w-full h-full overflow-y-auto">
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
              label: "Pagamento",
              content: <Installments />,
              valid: step2Valid,
            },
            {
              value: "step3",
              label: "Produtos",
              content: <Tabela />,
              valid: itemsValid,
            },
          ]}
        />
      </div>
      <div className="fixed bottom-0 left-0 w-full p-1 z-50">
        <FormProgressHoverCard />
      </div>
    </div>
  );
}
