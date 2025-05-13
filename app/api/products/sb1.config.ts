// Localização: app/api/products/sb1.config.ts
import { Prisma } from "@prisma/client";

// Tipagem para os argumentos da função de configuração
interface ProductSearchArgsInput {
  searchTerm: string;
  take?: number;
}

// Tipagem para o objeto de retorno, especificando os argumentos para Prisma.SB1010FindManyArgs
type ProductSearchPrismaArgs = Pick<
  Prisma.SB1010FindManyArgs,
  "where" | "select" | "take"
>;

const logPrefixConfig = "[SB1 Config]";

/**
 * Retorna os argumentos de configuração para a query de busca de produtos na SB1010.
 * @param input - Objeto contendo searchTerm e take (opcional).
 * @returns Objeto com as cláusulas 'where', 'select' e 'take' para o Prisma Client.
 */
export function getProductSearchPrismaArgs(
  input: ProductSearchArgsInput
): ProductSearchPrismaArgs {
  const { searchTerm, take = 50 } = input; // Padrão 'take' para 50, mais comum para paginação inicial
  console.log(
    `${logPrefixConfig} Recebido para getProductSearchPrismaArgs - Termo: "${searchTerm}", Take: ${take}`
  );

  // Constrói a cláusula 'where' para a busca
  const whereClause: Prisma.SB1010WhereInput = {
    AND: [
      {
        OR: [
          // Reintroduzido mode: 'insensitive' para busca case-insensitive
          { B1_COD: { contains: searchTerm.toUpperCase().trim() } },
          { B1_DESC: { contains: searchTerm.toUpperCase().trim() } },
        ],
      },
      {
        NOT: {
          D_E_L_E_T_: "*", // Exclui registros marcados como deletados
        },
      },
    ],
  };
  console.log(
    `${logPrefixConfig} Cláusula WHERE construída:`,
    JSON.stringify(whereClause, null, 2)
  );

  // Define os campos a serem selecionados no resultado da query
  const selectClause: Prisma.SB1010Select = {
    R_E_C_N_O_: true,
    B1_FILIAL: true,
    B1_COD: true,
    B1_DESC: true,
    B1_TIPO: true,
    B1_UM: true,
    B1_GRUPO: true,
    B1_PRV1: true,
    B1_LOCPAD: true,
    B1_MSBLQL: true,
    // B1_MARCA foi removido anteriormente para evitar erro de coluna inexistente
  };
  // Logar a cláusula select pode ser verboso, mas útil para confirmar campos
  // console.log(`${logPrefixConfig} Cláusula SELECT definida:`, JSON.stringify(selectClause, null, 2));

  const prismaArgs = {
    where: whereClause,
    select: selectClause,
    take: take,
  };
  console.log(
    `${logPrefixConfig} Argumentos Prisma finais:`,
    JSON.stringify(prismaArgs, null, 2)
  );
  return prismaArgs;
}
