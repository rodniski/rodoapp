// @inclusao/validation/prenota.schema.ts
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCurrency } from "utils"; // Supondo que você tenha essa função

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
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data deve estar no formato DD/MM/YYYY"),
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
    .positive("Valor deve ser maior que zero")
    .max(999999999.99, "Valor muito alto"),
});

/* 5 ▸ Item */
export const itemSchema = z.object({
  ITEM: z.string().regex(/^\d{5}$/, "Item deve ter 5 dígitos"), // Ajustado para "00001" do body
  PRODUTO: z
    .string({ required_error: "Produto é obrigatório" })
    .min(1, "Produto é obrigatório"),
  QUANTIDADE: z
    .number({
      required_error: "Quantidade é obrigatória",
      invalid_type_error: "Quantidade inválida",
    })
    .positive("Quantidade deve ser positiva"),
  VALUNIT: z
    .number({
      required_error: "Valor unitário é obrigatório",
      invalid_type_error: "Valor unitário inválido",
    })
    .positive("Valor unitário deve ser positivo"),
  TOTAL: z
    .number({
      required_error: "Valor total é obrigatório",
      invalid_type_error: "Valor total inválido",
    })
    .positive("Valor total deve ser positivo"),
  PRODFOR: z.string().min(1, "Código do produto do fornecedor é obrigatório"),
  DESCFOR: z.string().min(1, "Descrição do fornecedor é obrigatória"),
  ORIGEMXML: z.string().min(1, "Origem XML é obrigatória"),
  PC: z.string().optional(),
  ITEMPC: z.string().optional(),
  B1_UM: z
    .string({ required_error: "Unidade de medida é obrigatória" })
    .min(1, "Unidade de medida é obrigatória"),
  SEGUN: z.string().optional(),
  TPFATO: z.string().optional(),
  CONV: z.number().int().min(1, "Conversão deve ser um inteiro positivo"),
  ORIGEM: z.string().min(1, "Origem é obrigatória"),
  B1_DESC: z.string().optional(),
});

/* 6 ▸ Header */
export const headerSchema = z
  .object({
    FILIAL: z.string().min(1, "Filial é obrigatória"),
    OPCAO: z.literal(3),
    TIPO: z.enum(["N", "S"], { required_error: "Tipo de NF é obrigatório" }),
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
    tiporodo: z
      .enum([
        "Revenda",
        "Despesa/Imobilizado",
        "Materia Prima",
        "Collection",
        "Garantia Concebida",
        "",
      ])
      .optional(),
    prioridade: z.enum(["Alta", "Media", "Baixa", ""]).optional(),
    JUSTIFICATIVA: z.string().optional(),
    DTINC: z
      .string()
      .regex(
        /^\d{2}\/\d{2}\/\d{4}$/,
        "Data de inclusão deve estar no formato DD/MM/YYYY"
      ),
    CHVNF: z.string().length(44, "Chave NF-e deve ter 44 dígitos").optional(),
    OBS: z.string().optional(),
    CGCPIX: z.string().optional(),
    CHAVEPIX: z.string().optional(),
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
    PAGAMENTOS: z.array(parcelaSchema).min(1, "Adicione pelo menos 1 parcela"), // Ajustado para PAGAMENTOS
    ARQUIVOS: z.array(anexoSchema).min(1, "Adicione pelo menos 1 anexo"), // Ajustado para ARQUIVOS
    RATEIOS: z.array(rateioSchema).min(1, "Adicione pelo menos 1 rateio"), // Ajustado para RATEIOS
  })
  .superRefine((val, ctx) => {
    const totalNF = val.itens.reduce((s, i) => s + (i.TOTAL ?? 0), 0);

    // Validação das parcelas
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

    // Validação dos rateios
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

    // Validação da soma dos percentuais dos rateios
    const somaPerc = val.RATEIOS.reduce((s, r) => s + (r.percent ?? 0), 0);
    if (Math.abs(somaPerc - 100) > 0.01) {
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
