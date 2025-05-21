"use client";

import { AnimatedTabs } from "ui";
import {
  HeaderForm,
  Installments,
  FormProgressHoverCard,
  InclusaoTable,
  columns,
} from "@inclusao/components";
import { usePreNotaStore } from "@inclusao/stores";
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
  const itens = usePreNotaStore((state) => state.draft.itens);
  // Validação do cabeçalho
  const headerValidationResult = headerSchema.safeParse(draft.header);
  const headerValid =
    headerValidationResult.success &&
    !!draft.header.tiporodo &&
    draft.header.tiporodo.trim() !== "" &&
    !!draft.header.prioridade &&
    draft.header.prioridade.trim() !== "";

  // Validação da etapa 2: exige ao menos 1 parcela, 1 anexo e 1 rateio
  const step2Schema = z.object({
    parcelas: z.array(parcelaSchema).min(1, "Adicione ao menos 1 parcela"),
    anexos: z.array(anexoSchema).min(1, "Adicione ao menos 1 anexo"),
    rateios: z.array(rateioSchema).min(1, "Adicione ao menos 1 rateio"),
  });
  const step2ValidationResult = step2Schema.safeParse({
    parcelas: draft.PAGAMENTOS,
    anexos: draft.ARQUIVOS,
    rateios: draft.RATEIOS,
  });
  const step2Valid = step2ValidationResult.success;

  // Validação da etapa 3: exige ao menos 1 item
  const itemsValidationResult = z
    .array(itemSchema)
    .min(1, "Adicione ao menos 1 item")
    .safeParse(draft.itens);
  const itemsValid = itemsValidationResult.success;

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
              label: "Produtos",
              content: <InclusaoTable columns={columns} data={itens} />,
              valid: itemsValid,
            },
            {
              value: "step3",
              label: "Pagamento",
              content: <Installments />,
              valid: step2Valid,
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
