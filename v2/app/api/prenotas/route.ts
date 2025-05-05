
import { NextResponse } from "next/server";
import { getPrenotas } from "./service";

export async function handleGetPrenotas(request: Request) {
  try {
    const body = await request.json();
    const {
      pagination: { page = 1, pageSize = 10 } = {},
      filters = {}, // Garante que filters seja um objeto vazio por padrão
      sorting = [],
      filials = [],
      searchTerm,
    } = body;

    const result = await getPrenotas({
      page,
      pageSize,
      filters,
      sorting,
      filials,
      searchTerm,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro no controller handleGetPrenotas:", error);

    let statusCode = 500;
    let errorMessage = "Erro interno do servidor ao buscar prenotas.";

    if (error instanceof Error) {
      if (error.message.includes("array vazio") || error.message.includes("obrigatórias")) {
        statusCode = 400;
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

export { handleGetPrenotas as POST };