// prenotaDraft.schema.ts
import { z } from "zod";

/* ──────────────────────────────────────────────
 * Sub-schemas reutilizáveis
 * ──────────────────────────────────────────────*/

/* 1 ▸ Anexo -----------------------------------------------------------*/
export const anexoSchema = z.object({
  seq : z.string().regex(/^\d{3}$/,"Seq deve ter 3 dígitos"),
  arq : z.string().min(1,"Nome do arquivo obrigatório"),
  desc: z.string().optional(),          // descrição opcional
});

/* 2 ▸ Parcela ---------------------------------------------------------*/
export const parcelaSchema = z.object({
  Parcela    : z.string().regex(/^\d{3}$/,"Parcela deve ter 3 dígitos"),
  Vencimento : z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/,"Data DD/MM/AAAA"),
  Valor      : z.number().positive("Valor > 0"),
});

/* 3 ▸ Rateio ----------------------------------------------------------*/
export const rateioSchema = z.object({
  Z10_ITEM  : z.string().regex(/^\d{3}$/,"Item 3 dígitos"),
  Z10_FILRAT: z.string().min(4,"Filial 4 car."),
  Z10_CC    : z.string().min(1,"Centro de custo obrigatório"),
  Z10_VALOR : z.number().nonnegative(),
  Z10_PERC  : z.number().min(0).max(100),
  REC       : z.number().int().nonnegative().default(0),
});

/* 4 ▸ Item ------------------------------------------------------------*/
export const itemSchema = z.object({
  ITEM       : z.string().regex(/^\d{4}$/,"ITEM 4 dígitos"),
  PRODUTO    : z.string().min(1,"Produto obrigatório"),
  QUANTIDADE : z.number().positive(),
  VALUNIT    : z.number().positive(),
  TOTAL      : z.number().positive(),

  /* campos opcionais / xml */
  PRODFOR    : z.string().optional(),
  DESCFOR    : z.string().optional(),
  ORIGEMXML  : z.string().optional(),

  /* campos do pedido */
  PC         : z.string().optional(),
  ITEMPC     : z.string().optional(),
  B1_UM      : z.string().optional(),
  ORIGEM     : z.union([z.string(), z.number()]).optional(),

  /* extras opcionais */
  SEGUN      : z.string().optional(),
  TPFATO     : z.string().optional(),
  CONV       : z.number().optional(),
});

/* 5 ▸ Header (resumido) ----------------------------------------------*/
export const headerSchema = z.object({
  FILIAL     : z.string().min(4,"Filial obrigatória"),
  OPCAO      : z.literal(3),
  TIPO       : z.enum(["N","S"]),
  FORNECEDOR : z.string().min(1,"Fornecedor obrigatório"),
  LOJA       : z.string().min(1,"Loja obrigatória"),
  DOC        : z.string().min(1),
  SERIE      : z.string().min(1),
  ESPECIE    : z.string().min(1),
  CONDFIN    : z.string().min(1,"Condição fin. obrigatória"),
  USERAPP    : z.string().min(1),
  tiporodo   : z.string(),
  DTINC      : z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/,"Data DD/MM/AAAA"),

  CHVNF      : z.string().optional(),
  OBS        : z.string().optional(),
  prioridade : z.enum(["Alta","Média","Baixa"]).optional(),
  JUSTIFICATIVA: z.string().optional(),
  CGCPIX     : z.string().optional(),
  CHAVEPIX   : z.string().optional(),
});

/* ──────────────────────────────────────────────
 * Draft completo
 * ──────────────────────────────────────────────*/

export const prenotaDraftSchema = z.object({
  header   : headerSchema,
  itens    : z.array(itemSchema)
               .min(1,"Adicione pelo menos 1 item"),

  parcelas : z.array(parcelaSchema),

  anexos   : z.array(anexoSchema),

  rateios  : z.array(rateioSchema)
              /* soma dos percentuais deve ser 100 % */
              .superRefine((arr,ctx)=>{
                const soma = arr.reduce((s,r)=>s+r.Z10_PERC,0);
                if (soma !== 100){
                  ctx.addIssue({
                    code    :"custom",
                    message : `Soma dos percentuais (${soma} %) ≠ 100 %`,
                  });
                }
              }),
})

/* ──────────────────────────────────────────────
 * Regras de consistência adicionais
 *   – total NF = soma itens
 *   – total parcelas = total NF
 * ──────────────────────────────────────────────*/
.superRefine((val,ctx)=>{
  const totalNF  = val.itens.reduce((s,i)=>s+i.TOTAL,0);
  const somaParc = val.parcelas.reduce((s,p)=>s+p.Valor,0);

  if (somaParc !== totalNF){
    ctx.addIssue({
      code:"custom",
      path:["parcelas"],
      message:`Soma das parcelas (${somaParc}) ≠ total NF (${totalNF})`,
    });
  }
});

/* ──────────────────────────────────────────────
 * Type-aliases gerados pelo Zod  (novos)
 * ──────────────────────────────────────────────*/
export type HeaderSchemaParsed   = z.infer<typeof headerSchema>;
export type ItemSchemaParsed     = z.infer<typeof itemSchema>;
export type ParcelaSchemaParsed  = z.infer<typeof parcelaSchema>;
export type RateioSchemaParsed   = z.infer<typeof rateioSchema>;
export type AnexoSchemaParsed    = z.infer<typeof anexoSchema>;
export type PrenotaDraftParsed   = z.infer<typeof prenotaDraftSchema>;