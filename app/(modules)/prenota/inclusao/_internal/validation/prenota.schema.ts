/* ───────────────────────────  prenota.schema.ts  ───────────────────────────
 * Esquemas de validação para formulários de Pré-notas.
 *
 *  ┌────────────┐
 *  │  RESUMO    │  Define esquemas Zod para validação de inputs, como
 *  ├────────────┤  rateio, garantindo que os dados sejam válidos antes
 *  │  ESQUEMAS  │  de serem processados ou enviados ao backend.
 *  └────────────┘
 * -----------------------------------------------------------------------*/

import { z } from "zod";
import { formatCurrency } from "utils";
import { zodResolver } from "@hookform/resolvers/zod";

/* ──────────────────────────────────────────────
 * Sub-schemas reutilizáveis
 * ──────────────────────────────────────────────*/

/* 1 ▸ Anexo */
export const anexoSchema = z.object({
  seq: z.string().min(1, "Sequência do anexo é obrigatória"),
  arq: z.string().min(1, "Nome do arquivo é obrigatório"),
  desc: z.string().optional(),
});

/* 2 ▸ Parcela */
export const parcelaSchema = z.object({
  Parcela: z.string().regex(/^\d{3}$/, "Parcela deve ter 3 dígitos"),
  Vencimento: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data deve estar no formato DD/MM/YYYY")
    .or(z.literal("")),
  Valor: z
    .number({
      required_error: "Valor da parcela é obrigatório",
      invalid_type_error: "Valor da parcela inválido",
    })
    .positive("Valor da parcela deve ser positivo"),
});

/* 3 ▸ Rateio */
export const rateioSchema = z.object({
  seq: z.string().min(1, "Sequência do rateio é obrigatória"),
  id: z.string().min(1, "ID do rateio é obrigatório"),
  FIL: z.string().min(1, "Filial do rateio é obrigatória"),
  cc: z.string().min(1, "Centro de custo é obrigatório"),
  percent: z
    .number({
      required_error: "Percentual do rateio é obrigatório",
      invalid_type_error: "Percentual inválido",
    })
    .min(0, "Percentual não pode ser negativo")
    .max(100, "Percentual não pode exceder 100"),
  valor: z
    .number({
      required_error: "Valor do rateio é obrigatório",
      invalid_type_error: "Valor do rateio inválido",
    })
    .positive("Valor do rateio deve ser positivo"),
  REC: z
    .number()
    .int()
    .nonnegative("REC deve ser um inteiro não negativo")
    .default(0),
});

/* 4 ▸ Schema para o FORMULÁRIO de adição de rateio */
export const rateioInputSchema = z.object({
  FIL: z.string().min(1, "Seleção de Filial é obrigatória"),
  cc: z.string().min(1, "Seleção de Centro de Custo é obrigatória"),
  percent: z
    .number({ invalid_type_error: "Percentual inválido" })
    .min(0, "Percentual não pode ser negativo")
    .max(100, "Percentual não pode exceder 100"),
  valor: z
    .number({ invalid_type_error: "Valor inválido" })
    .min(0, "Valor não pode ser negativo")
    .max(999999999.99, "Valor muito alto"),
});

/* 5 ▸ Item */
export const itemSchema = z.object({
  ITEM: z.string().min(1, "Item é obrigatório"),
  PRODUTO: z.string().min(1, "Produto é obrigatório"),
  QUANTIDADE: z.number().positive("Quantidade deve ser positiva"),
  VALUNIT: z.number().min(0, "Valor unitário não pode ser negativo"),
  PRODFOR: z.string().optional(),
  DESCFOR: z.string().optional(),
  ORIGEMXML: z.string().optional().default("N"),
  TOTAL: z.number().min(0, "Total não pode ser negativo"),
  PC: z.string().optional(),
  ITEMPC: z.string().optional(),
  B1_UM: z.string().min(1, "Unidade de medida é obrigatória"),
  SEGUN: z.string().optional().default(""),
  TPFATO: z.string().optional().default(""),
  CONV: z
    .number()
    .int()
    .min(1, "Conversão deve ser um inteiro positivo")
    .optional()
    .default(1),
  ORIGEM: z.string().min(1, "Origem é obrigatória"),
  B1_DESC: z.string().optional(),
  DESC_PROD: z.string().optional(),
});

/* 6 ▸ Header */
const dateStringSchema = z.union([
  z.literal(""),
  z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data deve estar no formato DD/MM/YYYY"),
]);

export const headerSchema = z
  .object({
    FILIAL: z.string().min(1, "Filial é obrigatória"),
    OPCAO: z.literal(3),
    TIPO: z.enum(["N", "C"], { required_error: "Tipo de NF é obrigatório" }),
    FORNECEDOR: z
      .string({ required_error: "Fornecedor é obrigatório" })
      .min(1, "Fornecedor é obrigatório"),
    LOJA: z
      .string({ required_error: "Loja do fornecedor é obrigatória" })
      .min(1, "Loja é obrigatória"),
    DOC: z
      .string({ required_error: "Número do documento é obrigatório" })
      .min(1, "Documento é obrigatório"),
    SERIE: z
      .string({ required_error: "Série do documento é obrigatória" })
      .min(1, "Série é obrigatória"),
    ESPECIE: z
      .string({ required_error: "Espécie do documento é obrigatória" })
      .min(1, "Espécie é obrigatória"),
    CONDFIN: z
      .string({ required_error: "Condição financeira é obrigatória" })
      .min(1, "Condição financeira é obrigatória"),
    USERAPP: z
      .string({ required_error: "Usuário da aplicação é obrigatório" })
      .min(1, "Usuário é obrigatório"),
    tiporodo: z.enum(
      [
        "Revenda",
        "Despesa/Imobilizado",
        "Materia Prima",
        "Collection",
        "Garantia Concebida",
        "",
      ],
      { errorMap: () => ({ message: "Tipo de Nota Fiscal Invalido" }) }
    ),
    prioridade: z.enum(["Alta", "Media", "Baixa", ""], {
      errorMap: () => ({ message: "Prioridade inválida." }),
    }),
    JUSTIFICATIVA: z.string().optional(),
    DTINC: dateStringSchema,
    CHVNF: z
      .string()
      .length(44, "Chave NF-e deve ter 44 dígitos")
      .optional()
      .or(z.literal("")),
    OBS: z.string().optional(),
    CGCPIX: z.string().optional(),
    CHAVEPIX: z.string().optional(),
    PEDIDO: z.string().optional(),
    OLDSERIE: z.string().optional(),
  })
  .superRefine((obj, ctx) => {
    if (
      obj.prioridade === "Alta" &&
      (!obj.JUSTIFICATIVA || !obj.JUSTIFICATIVA.trim())
    ) {
      ctx.addIssue({
        path: ["JUSTIFICATIVA"],
        code: z.ZodIssueCode.custom,
        message: "Justificativa é obrigatória quando prioridade for Alta",
      });
    }
  });

/* ──────────────────────────────────────────────
 * Draft completo
 * ──────────────────────────────────────────────*/
export const prenotaDraftSchema = z
  .object({
    header: headerSchema,
    itens: z.array(itemSchema).min(1, "Adicione pelo menos 1 item na nota"),
    PAGAMENTOS: z.array(parcelaSchema).min(1, "Adicione pelo menos 1 parcela"),
    ARQUIVOS: z.array(anexoSchema).min(1, "Adicione pelo menos 1 anexo"),
    RATEIOS: z.array(rateioSchema).min(1, "Adicione pelo menos 1 rateio"),
  })
  .superRefine((val, ctx) => {
    const totalNF = val.itens.reduce((s, i) => s + (i.TOTAL ?? 0), 0);

    const somaParc = val.PAGAMENTOS.reduce((s, p) => s + (p.Valor ?? 0), 0);
    if (Math.abs(somaParc - totalNF) > 0.01) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["PAGAMENTOS"],
        message: `Soma das parcelas (${formatCurrency(
          somaParc
        )}) difere do total dos itens (${formatCurrency(
          totalNF
        )}). Verifique Pagamento.`,
      });
    }

    const somaRateiosValor = val.RATEIOS.reduce(
      (s, r) => s + (r.valor ?? 0),
      0
    );
    if (Math.abs(somaRateiosValor - totalNF) > 0.01) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["RATEIOS"],
        message: `Soma dos valores rateados (${formatCurrency(
          somaRateiosValor
        )}) difere do total dos itens (${formatCurrency(
          totalNF
        )}). Verifique Rateio.`,
      });
    }

    const somaPerc = val.RATEIOS.reduce((s, r) => s + (r.percent ?? 0), 0);
    if (val.RATEIOS.length > 0 && Math.abs(somaPerc - 100) > 0.01) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["RATEIOS"],
        message: `A soma dos percentuais (${somaPerc.toFixed(
          2
        )}%) deve ser exatamente 100%.`,
      });
    }
  });

/* Resolver para React Hook Form */
export const prenotaDraftResolver = zodResolver(prenotaDraftSchema);

/* ──────────────────────────────────────────────
 * Type-aliases gerados pelo Zod
 * ──────────────────────────────────────────────*/
export type RateioInputSchemaParsed = z.infer<typeof rateioInputSchema>;
export type HeaderSchemaParsed = z.infer<typeof headerSchema>;
export type ItemSchemaParsed = z.infer<typeof itemSchema>;
export type ParcelaSchemaParsed = z.infer<typeof parcelaSchema>;
export type RateioSchemaParsed = z.infer<typeof rateioSchema>;
export type AnexoSchemaParsed = z.infer<typeof anexoSchema>;
export type PrenotaDraftParsed = z.infer<typeof prenotaDraftSchema>;
