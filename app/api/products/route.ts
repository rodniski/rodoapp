// Localização: app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, SB1010 } from '@prisma/client';
import { getProductSearchPrismaArgs } from './sb1.config'; // Caminho relativo ao diretório atual

const prisma = new PrismaClient();

// Tipagem para os dados retornados
// Removido B1_MARCA para alinhar com a selectClause em sb1.config.ts
export type ProductSearchResult = Pick<
  SB1010,
  'R_E_C_N_O_' | 'B1_FILIAL' | 'B1_COD' | 'B1_DESC' | 'B1_TIPO' | 'B1_UM' | 'B1_GRUPO' | 'B1_PRV1' | 'B1_LOCPAD' | 'B1_MSBLQL'
>;

export async function GET(request: NextRequest) {
  const logPrefix = "[API /api/products]";
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`; // ID único para a requisição
  console.log(`${logPrefix} [${requestId}] Rota GET acessada. URL: ${request.url}`);

  const searchParams = request.nextUrl.searchParams;
  const searchTerm = searchParams.get('search');
  // A variável filial não é mais usada para a busca, mas pode ser logada se presente
  const filialParam = searchParams.get('filial');
  const limitParam = searchParams.get('limit');

  if (!searchTerm || searchTerm.trim() === '') {
    console.warn(`${logPrefix} [${requestId}] Parâmetro 'search' ausente ou vazio.`);
    return NextResponse.json(
      { error: 'O parâmetro de busca "search" é obrigatório.' },
      { status: 400 }
    );
  }

  let take = 50; // Valor padrão
  if (limitParam) {
    const parsedLimit = parseInt(limitParam, 10);
    if (!isNaN(parsedLimit) && parsedLimit > 0) {
      take = parsedLimit;
    } else {
      console.warn(`${logPrefix} [${requestId}] Parâmetro 'limit' inválido: "${limitParam}". Usando padrão ${take}.`);
    }
  }
  
  const trimmedSearchTerm = searchTerm.trim();
  console.log(`${logPrefix} [${requestId}] Parâmetros de busca recebidos - Termo: "${trimmedSearchTerm}", Filial (parâmetro URL): "${filialParam || 'N/A'}", Limite: ${take}`);

  try {
    // Obtém os argumentos para a query Prisma
    // Removida a passagem de 'filial' pois não é mais usada em getProductSearchPrismaArgs
    const prismaArgs = getProductSearchPrismaArgs({
      searchTerm: trimmedSearchTerm,
      take,
    });
    // Log detalhado dos argumentos que serão usados na query
    console.log(`${logPrefix} [${requestId}] Argumentos para Prisma.sB1010.findMany:`, JSON.stringify(prismaArgs, null, 2));

    const startTime = Date.now();
    const products = await prisma.sB1010.findMany(prismaArgs);
    const duration = Date.now() - startTime;
    console.log(`${logPrefix} [${requestId}] Query ao banco de dados executada em ${duration}ms.`);

    if (!products || products.length === 0) {
      console.log(`${logPrefix} [${requestId}] Nenhum produto encontrado para o termo: "${trimmedSearchTerm}".`);
      return NextResponse.json([], { status: 200 });
    }

    console.log(`${logPrefix} [${requestId}] ${products.length} produtos encontrados para o termo: "${trimmedSearchTerm}".`);
    // Se precisar ver os dados retornados (cuidado com dados sensíveis em logs de produção):
    // console.log(`${logPrefix} [${requestId}] Dados dos produtos:`, JSON.stringify(products, null, 2));


    const result: ProductSearchResult[] = products;
    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    // Log mais detalhado do erro
    console.error(`${logPrefix} [${requestId}] Erro ao buscar produtos para o termo: "${trimmedSearchTerm}". Detalhes:`, error);
    
    let errorMessage = 'Erro interno do servidor ao processar a busca.';
    let errorDetails = {};

    if (error instanceof Error) {
        errorMessage = error.message; // Mensagem de erro mais específica
        errorDetails = {
            name: error.name,
            // stack: error.stack, // Pode ser muito verboso, mas útil para depuração profunda
        };
    }
    // Se for um erro conhecido do Prisma, ele pode ter 'meta' ou 'code'
    if (error.code) {
        errorDetails = { ...errorDetails, prismaCode: error.code };
    }
    if (error.meta) {
        errorDetails = { ...errorDetails, prismaMeta: error.meta };
    }

    console.error(`${logPrefix} [${requestId}] Detalhes do erro formatado:`, errorDetails);

    return NextResponse.json(
      { 
        error: 'Erro interno do servidor ao processar a busca.',
        // Em desenvolvimento, você pode querer retornar mais detalhes do erro:
        // details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        // prismaDetails: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
      },
      { status: 500 }
    );
  } finally {
    console.log(`${logPrefix} [${requestId}] Finalizando requisição. Desconectando do Prisma.`);
    await prisma.$disconnect().catch(disconnectError => {
        console.error(`${logPrefix} [${requestId}] Erro ao desconectar do Prisma:`, disconnectError);
    });
  }
}
