// validationSchema.ts
import {z} from "zod";

export const preNotaSchema = z.object({
    FILIAL: z.string().min(1, "Filial é obrigatória"),
    FORNECEDOR: z.string().min(1, "Fornecedor é obrigatório"),
    LOJA: z.string().min(1, "Loja é obrigatória"),
    DOC: z.string().min(1, "Documento é obrigatório"),
    SERIE: z.string().min(1, "Série é obrigatória"),
    CONDFIN: z.string().min(1, "Condição de pagamento é obrigatória"),
    prioridade: z.enum(["Alta", "Media", "Baixa"], {
        message: "Prioridade obrigatória",
    }),
    tiporodo: z.string().min(1, "Tipo da nota é obrigatório"),
    DTINC: z.string().min(1, "Data de inclusão é obrigatória"),
    PAGAMENTOS: z.array(z.any()).nonempty("Pagamentos são obrigatórios"), // Substitua z.any() pelo schema real
    RATEIOS: z.array(z.any()).nonempty("Rateios são obrigatórios"), // Substitua z.any() pelo schema real
    itens: z.array(z.any()).nonempty("Itens são obrigatórios"), // Substitua z.any() pelo schema real
    // Campos opcionais (não precisam de validação)
    OPCAO: z.number().optional(),
    TIPO: z.enum(["N", "C"]).optional(),
    OLDSERIE: z.string().optional(),
    ESPECIE: z.string().optional(),
    CHVNF: z.string().optional(),
    OBS: z.string().optional(),
    JUSTIFICATIVA: z.string().optional(),
    CGCPIX: z.string().optional(),
    CHAVEPIX: z.string().optional(),
    ARQUIVOS: z.array(z.any()).optional(), // Substitua z.any() pelo schema real
    USERAPP: z.string().optional(), // Se for derivado de usernameAtom, não precisa validar
});