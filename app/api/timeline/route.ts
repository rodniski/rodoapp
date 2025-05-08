import { NextResponse } from "next/server";
import { prisma } from "@/app/server/prisma";
import {
  mapFullTimelineToEventos,
  FullTimelineSqlRow,
  getFullTimelineQuery,
} from ".";
import { handleApiError, ApiError } from "utils";

export async function GET(request: Request) {
  const logPrefix = "[API /timeline]";
  console.log(`${logPrefix} Rota acessada`);

  try {
    const { searchParams } = new URL(request.url);
    const rec = searchParams.get("rec");

    if (!rec) {
      throw new ApiError("Parâmetro 'rec' é obrigatório.", 400);
    }

    const id = parseId(rec);
    const query = getFullTimelineQuery(id);

    console.log(`${logPrefix} Executando query para rec=${rec}...`);
    const results = await prisma.$queryRaw<FullTimelineSqlRow[]>(query);

    console.log(`${logPrefix} ${results?.length ?? 0} linhas encontradas.`);

    const eventos = mapFullTimelineToEventos(results);

    return NextResponse.json(eventos);
  } catch (error) {
    return handleApiError(error, logPrefix);
  }
}

/**
 * Valida e converte o ID recebido como string para número.
 * @param id - Valor do parâmetro rec
 * @returns Número válido
 * @throws ApiError se o valor não for numérico
 */
function parseId(id: string): number {
  const parsed = parseInt(id, 10);
  if (isNaN(parsed)) {
    throw new ApiError("ID deve ser um número válido.", 400);
  }
  return parsed;
}
